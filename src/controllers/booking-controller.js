const {StatusCodes} = require('http-status-codes');
const {BookingService} = require('./../service/index.js');
const bookingService = new BookingService();

class BookingController{
    
    async create(req,res,next){
        try{
            const booking = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.CREATED).json({
                data : booking,
                success : true,
                message : "Booking created successfully",
                err : {}
            })
        }catch(error){
            next(error);
        }
    }
    async get(req,res){
        try{
            const booking = await bookingService.getBooking(req.params.id);
            return res.status(StatusCodes.ACCEPTED).json({
                data : booking,
                success : true,
                message : "Booking fetched successfully",
                err : {}
            })
        }catch(error){
            next(error);
        }
    }
    async update(req,res){
        try{
            const booking = await bookingService.updateBooking(req.params.id,req.body);
            return res.status(StatusCodes.ACCEPTED).json({
                data : booking,
                success : true,
                message : "Booking updated successfully",
                err : {}
            })
        }catch(error){
            next(error);
        }
    }
};




module.exports = BookingController;