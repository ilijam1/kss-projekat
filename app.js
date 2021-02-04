var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose=require('mongoose');
//var authMiddleware=require('./database/authMiddleware');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter=require('./routes/register');
var loginRouter=require('./routes/login');
var profileRouter=require('./routes/profile');
var pictureRouter=require('./routes/pictures');
var app = express();

mongoose.connect('mongodb://localhost:27017/IlijaProjekat', {useNewUrlParser: true, useUnifiedTopology: true});

// view engine setup

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var LoginSystemMiddleware =function (req,res,next){
  if(req.cookies.logined=='true'){
next();
}else{
  res.end('Nedozvoljen pristup molimo vas ulogujte se')
}
}



app.use('/', indexRouter);
app.use('/register',registerRouter);
app.use('/login',loginRouter);
app.use(LoginSystemMiddleware);
app.use('/users', usersRouter);
app.use('/profile',profileRouter);
app.use('/pictures',pictureRouter);


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
