const router = require("express").Router();
const mapsControl = require('./mapControl');
const {username} = require('../middleware/user'); 

router.put('/updateNode', mapsControl.updateNode);
router.post('/createMap',username, mapsControl.createMap)
router.get('/get-all-maps',mapsControl.getMaps)

module.exports = router;