const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { requestLogger } = require('./middleware/log')
const errorMiddleware = require('./middleware/errorMiddleware')

const PORT = process.env.PORT || 3500;

// Middleware works like waterfall, means if you put on the top level
// below will apllied the middleware

// Custom Middlware Logger
app.use(requestLogger)

// Cors middleware Cross Origin Resource sharing
const whiteList = ['http://localhost:3500', 'http://127.0.0.1:3500'];
const corsOptions = {
    origin: (origin, callback) => {

        // during development there is no origin, so we need to include it on the logic
        if (whiteList.indexOf(origin) !== -1 | !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed to access by cors'))
        }
    },
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data
app.use(express.json());

// built-in middleware to handle static files in public
app.use(express.static(path.join(__dirname, '/public')))

// lil  regex lesson : ^ are for start with and $ for end with.
//  now if you put text inside (_) and add ? like this: (.html)? it will put the items optional
// | is same like "or"

app.get('^/$|index(.html)?', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
app.get('^/new-page$|/new-page(.html)?', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

// handling redirect
app.get('^/old-page$|/old-page(.html)?', function (req, res) {
    // Handle permanent redirect with status code of 308
    res.redirect(308, '/new-page') // by default it's 307 for temporary redirect
})

// Handling Empty Route
app.all('*', (req, res) => {

    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorMiddleware)

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))