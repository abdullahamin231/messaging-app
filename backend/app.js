var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');


const initializePassport = require('./passportConfig');
initializePassport(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat.js');

var app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://email:password@cluster0.cfczsr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
main().catch((err) => console.log(err));
async function main() {
  console.log("connecting to database");
  await mongoose.connect(mongoDB);
  console.log("connected to database");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret: "secret key",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

var corsOptions = {
  origin: 'http://localhost:5173', // or use '*' to allow all origins
  credentials: true, // enable this if you're using sessions or cookies
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));



// Routing 

app.use('/', indexRouter);
app.use('/chats', chatRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
