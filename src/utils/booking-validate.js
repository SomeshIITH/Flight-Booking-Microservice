const {z} = require('zod');

const bookingSchema = z.object({
    flightId : z.coerce.number().int().positive(),
    userId : z.coerce.number().int().positive(),
    noOfSeats : z.coerce.number().int().optional().min(1).default(1)
}).strict();

module.exports = bookingSchema;