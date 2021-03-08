"use strict";

var router = require("express").Router();

var mapsControl = require('./mapControl');

var _require = require('../middleware/user'),
    username = _require.username;

router.put('/updateNode', mapsControl.updateNode);
router.post('/createMap', username, mapsControl.createMap);
module.exports = router;