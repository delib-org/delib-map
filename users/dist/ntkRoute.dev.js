"use strict";

var router = require("express").Router();

var networkControl = require('./usersControl');

router.put('/updateNode', networkControl.updateNode);
module.exports = router;