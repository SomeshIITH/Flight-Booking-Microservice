const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

module.exports = {
    PORT : process.env.PORT || 3001,
    SALT : bcrypt.genSaltSync(10),
    JWT_KEY : process.env.JWT_KEY,
    FLIGHT_SERVICE_PATH : process.env.FLIGHT_SERVICE_PATH,
    PAYMENT_SERVICE_PATH : process.env.PAYMENT_SERVICE_PATH,
    USER_SERVICE_PATH : process.env.USER_SERVICE_PATH,
    
    //used in utility
    MESSAGE_BROKER_URL : process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    QUEUE_NAME : process.env.QUEUE_NAME,
    //used in booking service to create ticket
    REMINDER_BINDING_KEY : process.env.REMINDER_BINDING_KEY,
}