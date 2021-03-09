"use strict";

var router = require("express").Router();

var usersControl = require('./usersControl');

router.post('/simpleLogin', usersControl.simpleLogin);
module.exports = router;