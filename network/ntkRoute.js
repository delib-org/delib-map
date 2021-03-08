const router = require("express").Router();

const networkControl = require('./ntkControl');

router.put('/updateNode', networkControl.updateNode);

module.exports = router;