const {Booking} = require('./../models/index.js');

class BookingRepository{
    async createBooking(data){
        try{
            const booking = await Booking.create(data);
            return booking;
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