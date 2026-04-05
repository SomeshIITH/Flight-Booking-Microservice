const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('./../service/index.js');
const bookingService = new BookingService();

const create = async(req,res) => {
    try{
        const booking = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : booking,
            success : true,
            message : "Booking created successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong",
            err : error
        })
    }
}

const get = async(req,res) => {
    try{
        const booking = await bookingService.getBooking(req.params.id);
        return res.status(StatusCodes.ACCEPTED).json({
            data : booking,
            success : true,
            message : "Booking fetched successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong",
            err : error
        })
    }
}

const update = async(req,res) => {
    try{
        const booking = await bookingService.updateBooking(req.params.id,req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : booking,
            success : true,
            message : "Booking updated successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            data : {},
            success : false,
            message : "Something went wrong",
            err : error
        })
    }
}

module.exports = {create,get,update};