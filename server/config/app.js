let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let passport = require('passport'); // Import passport earlier
let passportLocal = require('passport-local');
let localStrategy = require('passport-local').Strategy;
let flash = require('connect-flash');
let app = express();

// Create user model instance
let userModel = require('../model/user');
let User = userModel.User;

// Initialize session middleware
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false,
}));


passport.use(User.createStrategy());

// Configure Passport.js
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.user;
  res.locals.displayName = req.user ? req.user.displayName : '';
  next();
});



// Configure Passport.js


// Use flash for storing messages
app.use(flash());

// Routers
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let tournamentRouter = require('../routes/tournament');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Mongoose connection
const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => {
  console.log("Connected with the MongoDB");
});

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tournamentslist',tournamentRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
