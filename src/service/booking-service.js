const {BookingRepository} = require('./../repository/index.js');

class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try{
            const booking = await this.bookingRepository.createBooking(data);
            return booking;
        }catch(error){
            console.log("Something went wrong in service layer");
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
}

module.exports = BookingService;