const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises;

const logEvents = require('./middleware/log')
const EventEmitter = require('events')
class MyEmitter extends EventEmitter { }
// Init my emitter
const myEmitter = new MyEmitter()
// Add Listerner to log Event
// myEmitter.on('log', (message) => logEvents(message))
// myEmitter.emit('log', 'THis is message from emitter-2')

// Defining Port
const PORT = process.env.PORT || 3500;

// Defining basic server
// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method)


//     // INNEFFICIENT EXAMPLE
//     // Build the path and serve the requested file
//     let filePath;
//     // if (req.url === '/' || req.url === 'index.html') {
//     //     res.statusCode = 200;
//     //     res.setHeader('Content-Type', 'text/html');
//     //     // Serve the index html
//     //     filePath = path.join(__dirname, 'views', 'index.html')
//     //     fs.readFile(filePath, 'utf8', (err, data) => {
//     //         res.end(data)
//     //     })
//     // }

//     switch (req.url) {
//         case '/':
//             res.statusCode = 200;
//             filePath = path.join(__dirname, 'views', 'index.html')
//             fs.readFile(filePath, 'utf8', (err, data) => {
//                 res.end(data)
//             })
//             break;

//         default:
//             res.statusCode = 404;


//             filePath = path.join(__dirname, 'views', '404.html')
//             fs.readFile(filePath, 'utf8', (err, data) => {
//                 res.end(data);
//             })
//             break;

//     }

// })

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}


const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    // getting the extension first
    const extension = path.extname(req.url)

    let contentType;

    // setting the contentType based on extension
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }

})


server.listen(PORT, () => console.log(`Server listening on ${PORT}`))