var studentRouter = require('./students');
var express = require('express');
var router = express.Router();


router.use('/students', studentRouter);
//router.use('/marks', marksRouter);
module.exports = router;