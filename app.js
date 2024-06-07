//All our 3rd party dependencies are being imported
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

//Our routes are being imported
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog')
const wikiRouter = require('./routes/wiki');



var app = express();

// Set Up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
//Setting StrictQuery to false in order to opt into filtering by properties that arent in the schema
mongoose.set("strictQuery", false);
//Define the db url to connect to.
const dev_db_url = `mongodb+srv://${process.env.MONGODB_TEST}:${process.env.MONGODB_TESTPW}@cluster0.h4ywfx6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const mongoDB = process.env.MONGODB_URI || dev_db_url;

try {
  //Attempt to connect to MongoDB
  main();
} catch (error) {
  //Log Error it it cannot connect
  console.log(error);
}
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(compression()); // Compress All Routes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
