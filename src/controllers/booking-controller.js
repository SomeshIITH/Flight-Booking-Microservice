const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('./../service/index.js');
const bookingService = new BookingService();
const {createChannel,publishMessage} = require('./../utils/message-queue.js')
const {REMINDER_BINDING_KEY} = require('./../config/serverConfig.js');

class BookingController{
    
    async sendMessageToQueue(req,res){
        try{
            const channel = await createChannel();
            const jsonmessage = JSON.stringify({message : "Success full"});
            // console.log("channel created");
            publishMessage(channel,REMINDER_BINDING_KEY,jsonmessage);
            // console.log("message sent to queue");
            return res.status(StatusCodes.ACCEPTED).json({
                data : {},
                success : true,
                message : "Message sent to queue successfully",
                err : {}
            })
        }
        catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                data : {},
                success : false,
                message : "Something went wrong in sending message",
                err : error
            })
        }
    }
    async create(req,res){
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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                data : {},
                success : false,
                message : "Something went wrong",
                err : error
            })
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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                data : {},
                success : false,
                message : "Something went wrong",
                err : error
            })
        }
    }
};




module.exports = BookingController;