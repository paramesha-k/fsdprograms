var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const crypto = require("crypto");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect("mongodb://127.0.0.1:27017/fsddb");

// User collection
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
   });
const User = mongoose.model("cuser", userSchema);

// Login API
app.post("/login", async (req, res) => {

    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                message: "Username and password required"
            });
        }
       console.log("Received login request for username:", name);
        // 1. Find user
        const user = await User.findOne({ username: name });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // 2. Hash entered password
        const hash = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");
        console.log("Entered password hash:", hash);
        // 3. Compare hashes
        if (hash === user.password) {
            return res.status(200).json({
                success: true,
                message: "Login successful"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});













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
