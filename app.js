const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();
const parser = require('./bin/main');
const schedule = require('node-schedule');
//const missNAU = require('./bin/missNAU.js');
//server
let data = parser.data, start = true;
//let dataMISS = missNAU.data;
if(start)
{
  //missNAU.start();
  start = false;
  parser.start();
}
schedule.scheduleJob("*/5 * * * *",function () {
  parser.start();
});

//setInterval(parser.start,60000);
app.get('/', function (req, res) {
  res.render('index', {data: data});
});
app.get('/select', function(req, res) {
  res.json({ data: JSON.stringify(data) });
});

//miss
/*app.get('/miss', function (req, res) {
  res.render('missNAU', {data: dataMISS});
});
app.get('/selectMISS', function(req, res) {
  missNAU.start();
  res.json({ data: JSON.stringify(dataMISS) });
});*/
//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
