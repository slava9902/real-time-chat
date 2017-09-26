'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.post('/', function(req, res, next) {
    console.log("hiiiiiii");
//    console.log(req.body.user)

    res({'ss':'asdad'})
});

module.exports = router;
