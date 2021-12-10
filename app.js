// Requiring the packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var passport = require('passport');

require('dotenv').config();
require('./modules/passport');

// Requiring The Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboard = require('./routes/dashboard');
var incomeRouter = require('./routes/income');
var expenseRouter = require('./routes/expense');
var auth = require('./middlewares/auth');

// Connecting To Database
mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log('Connected To Database: ', err ? err : true);
  }
);

// Instantiating The Application
var app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Using Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true => .scss and false = >.sass
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// Creating The Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
    }),
  })
);

// Using OAuth
app.use(passport.initialize());
app.use(passport.session());

// Using Flash To show Error Mesaages
app.use(flash());

// Using The Logged In User Information
app.use(auth.userInfo);
// Using The Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboard);
app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);

//  Catch 404 And Frward To Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
