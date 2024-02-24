const { format, formatDistance } = require('date-fns')
const { v4: uuid } = require('uuid');

const fs = require('fs')
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    // Logger Events Functions
    const dateTime = `${format(Date.now(), 'dd-mm-yyyy\tHH:MM:ss', { addsuffix: true })}`
    const logItem = `${dateTime}\t${uuid()}\tmessage: ${message}\n`
    console.log(logItem)
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)


    } catch (error) {
        console.error(error)
    }
}


const requestLogger = (req, res, next) => {
    logEvents(`Method: ${req.method} \t Origin: ${req.headers.origin} \t Url: ${req.url} \t path: ${req.path}`, 'requestLog.txt')
    next()
}

// console.log(format(Date.now(), 'dd-mm-yyyy'));
// console.log('from afif born:')
// console.log(formatDistance(new Date(2001, 10, 12), Date.now(), { includeSeconds: true, addSuffix: true }));

module.exports = { requestLogger, logEvents }
