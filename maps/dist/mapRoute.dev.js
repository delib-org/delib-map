"use strict";

var router = require("express").Router();

var mapsControl = require('./mapControl');

var _require = require('../middleware/user'),
    username = _require.username;

router.put('/updateNode', mapsControl.updateNode);
router.post('/createMap', username, mapsControl.createMap);
router.get('/get-all-maps', mapsControl.getMaps);
router.get('/get-map', mapsControl.getMap);
router.post('/createNode', mapsControl.createNode);
module.exports = router;