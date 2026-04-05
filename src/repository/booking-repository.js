const {Booking} = require('./../models/index.js');
const axios = require('axios');
const {FLIGHT_SERVICE_PATH} = require('./../config/serverConfig.js');

class BookingRepository{
    async createBooking(data){
        try{
            const flightId = data.flightId;
            // console.log(FLIGHT_SERVICE_PATH);
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            // console.log(getFlightRequestUrl);
            const response = await axios.get(getFlightRequestUrl);
            // console.log("response",response);
            const flightData  = response.data.data; //because 1 data will be od axios response, and 1 is for as we make response i use data : success : message :err
            let priceofFlight = flightData.price;
            // console.log(flightData);

            if(data.noOfSeats > flightData.totalSeats){
                throw new Error("Seats are not available");
            }
            const totalCost = priceofFlight * data.noOfSeats;
            const bookingpayload = {...data,totalCost};

            const booking  = await Booking.create(bookingpayload);
            const updateFlightRequestUrl =`${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}` ;
            console.log(updateFlightRequestUrl);
            await axios.patch(updateFlightRequestUrl,{totalSeats : flightData.totalSeats - data.noOfSeats});
            const finalBooking = await this.updateBooking(booking.id,{status : "Booked"});
            console.log(finalBooking);
            return finalBooking;
        }catch(error){
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }
    async getBooking(bookingId){
        try{
            const booking = await Booking.findByPk(bookingId);
            return booking;
        }catch(error){
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }
    async updateBooking(bookingId,data){
        try{
            const booking = await Booking.findByPk(bookingId);
            booking.status = data.status;
            await booking.save();
            return booking;
        }catch(error){
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }
}

module.exports = BookingRepository;