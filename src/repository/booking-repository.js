const {Booking} = require('./../models/index.js');
const axios = require('axios');
const {FLIGHT_SERVICE_PATH} = require('./../config/serverConfig.js');
const {StatusCodes} = require('http-status-codes');
const AppError = require('./../utils/app-error.js');



class BookingRepository{
    async createBooking(data,transaction){
        try{
            // const flightId = data.flightId;
            // // console.log(FLIGHT_SERVICE_PATH);
            // const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            // // console.log(getFlightRequestUrl);
            // const response = await axios.get(getFlightRequestUrl);
            // // console.log("response",response);
            // const flightData  = response.data.data; //because 1 data will be od axios response, and 1 is for as we make response i use data : success : message :err
            // let priceofFlight = flightData.price;
            // // console.log(flightData);

            // if(data.noOfSeats > flightData.totalSeats){
            //     throw new Error("Seats are not available");
            // }
            // const totalCost = priceofFlight * data.noOfSeats;
            // const bookingpayload = {...data,totalCost};

            // const booking  = await Booking.create(bookingpayload);
            // const updateFlightRequestUrl =`${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}` ;
            // console.log(updateFlightRequestUrl);
            // await axios.patch(updateFlightRequestUrl,{totalSeats : flightData.totalSeats - data.noOfSeats});
            // const finalBooking = await this.updateBooking(booking.id,{status : "Booked"});
            // console.log(finalBooking);
            // return finalBooking;
            const booking = await Booking.create(data,{transaction});
            if(!booking)throw new AppError("Booking not created",StatusCodes.INTERNAL_SERVER_ERROR);
            return booking;

        }catch(error){
            throw error;
        }
    }
    async getBooking(bookingId){
        try{
            const booking = await Booking.findByPk(bookingId);
            if(!booking)throw new AppError("Booking not found",StatusCodes.NOT_FOUND);
            return booking;
        }catch(error){
            throw error;
        }
    }
    async updateBooking(bookingId,data){
        try{
            const booking = await Booking.findByPk(bookingId);
            if(!booking)throw new AppError("Booking not found",StatusCodes.NOT_FOUND);
            if(data.status)booking.status = data.status;
            if(data.transactionId)booking.transactionId = data.transactionId;
            await booking.save();
            return booking;
        }catch(error){
            throw error;
        }
    }
}

module.exports = BookingRepository;