const {BookingRepository} = require('./../repository/index.js');
const axios = require('axios');
const {FLIGHT_SERVICE_PATH,PAYMENT_SERVICE_PATH,USER_SERVICE_PATH} = require('./../config/serverConfig.js');
const db = require('./../models/index.js');
const {StatusCodes} = require('http-status-codes');
const AppError = require('./../utils/app-error.js');
const {createChannel,publishMessage} = require('./../utils/message-queue.js');
const {REMINDER_BINDING_KEY} = require('./../config/serverConfig.js');



class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        //SAGA PATTERN -- HOLD AND RELEASE
        // Start a transaction to ensure Atomicity (All or Nothing)
        const transaction = await db.sequelize.transaction();
        try{
            const flightId = data.flightId;
            const getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const flightpayload = await axios.get(getFlightUrl);
            const flightData = flightpayload.data.data;//one data is for axios one is of our request
            
            // 1. Business Validation
            if(data.noOfSeats > flightData.remainingSeats){
                throw new AppError("Seats are not available",StatusCodes.BAD_REQUEST);
            }

            let totalCost = flightData.price * data.noOfSeats;
            const bookingPayload = {...data,totalCost,departureTime : flightData.departureTime,'status' : 'PENDING'};

             // 2. Create local booking record (PENDING)
            const booking = await this.bookingRepository.createBooking(bookingPayload,transaction);

            // 3. SEAT HOLD: Deduct seats from Flight Service immediately
            const updateFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            await axios.patch(updateFlightUrl,{remainingSeats : flightData.remainingSeats - data.noOfSeats});

            // Commit the "Hold" so seats are reserved while we wait for payment
            await transaction.commit();

            //4 . Payment Gateway
            try{
                const paymentUrl = `${PAYMENT_SERVICE_PATH}/api/v1/payments`;
                const paymentResponse = await axios.post(paymentUrl,{bookingId : booking.id,userId : data.userId,amount : totalCost});
                if (paymentResponse.data.status !== 'SUCCESS') {
                    throw new Error("Payment declined by gateway");
                }
                //  5. SUCCESS: Move to BOOKED and store the transactionId
                const finalBooking = await this.bookingRepository.updateBooking(booking.id,{status : "BOOKED",transactionId : paymentResponse.data.data.transactionId});
                const getUserUrl = `${USER_SERVICE_PATH}/api/v1/users/${data.userId}`;
                const userResponse = await axios.get(getUserUrl);
                const userData = userResponse.data.data;

                //6 . BOOKING CREATED SUCCESSFULLY THEN SEND IT TO QUEUE
                const channel = await createChannel();
                const payload = JSON.stringify({
                    data : {
                        subject : "Booking Confirmed",
                        content: `Your booking for flight ${finalBooking.flightId} is successful!`,
                        recipientEmail : userData.email,
                        notificationTime : finalBooking.departureTime
                    },
                    service: "CREATE_TICKET"  // Helps the Reminder service identify the task
                })
                await publishMessage(channel,REMINDER_BINDING_KEY,payload);
                return finalBooking;

            }catch(paymentErorr){
                // 6. FAILURE: Trigger Compensating Transaction (Release Seats)
                await this.cancelBooking(booking.id);
                throw new AppError("Payment failed. Reservation cancelled.", StatusCodes.PAYMENT_REQUIRED);
            }

        }catch(error){
           // Rollback only if the "Hold" phase wasn't committed yet
            if (transaction && !transaction.finished) {
                await transaction.rollback();
            }
            throw error;
        }   
    
    }

    async getBooking(bookingId){
        try{
            const booking = await this.bookingRepository.getBooking(bookingId);
            return booking;
        }catch(error){
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

    async updateBooking(bookingId,data){
        try{
            const booking = await this.bookingRepository.updateBooking(bookingId,data);
            return booking;
        }catch(error){
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

    async cancelBooking(bookingId){
        try{
            const booking = await this.bookingRepository.getBooking(bookingId);
            if (booking.status === 'CANCEL') return booking;

            // Return seats to Flight Service
            const getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            const flightResponse = await axios.get(getFlightUrl);
            const flightData = flightResponse.data.data;

            const updateFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightUrl, { 
                remainingSeats: flightData.remainingSeats + booking.noOfSeats 
            });

            return await this.bookingRepository.updateBooking(bookingId, { status: 'CANCEL' });
        }catch(error){
            console.error("Critical Failure: Could not revert seat hold for booking", bookingId);
            throw error;
        }
    }
}

module.exports = BookingService;