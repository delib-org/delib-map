"use strict";

var router = require("express").Router();

var networkControl = require('./mapControl');

router.put('/updateNode', networkControl.updateNode);
module.exports = router;