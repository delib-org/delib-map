const router = require("express").Router();
const mapsControl = require('./mapControl');
const {username} = require('../middleware/user'); 

router.put('/updateNode', mapsControl.updateNode);
router.post('/createMap',username, mapsControl.createMap)

module.exports = router;