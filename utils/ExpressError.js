//This class is used to handle errors and display custom messages 
//Here error is the default express error stack


class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}


module.exports = ExpressError;