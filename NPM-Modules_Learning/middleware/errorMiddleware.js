const { logEvents } = require('./log')
const errorMiddleware = (err, req, res, next) => {
    // Error logger
    logEvents(`${err.name}\t ${err.message}\tOrigin: ${req.headers.origin}`, 'errorLog.txt')
    console.error(err.stack)
    res.status(500).send(err.message)
}



module.exports = errorMiddleware;