const router = require("express").Router();

const usersControl = require('./usersControl');

router.post('/simpleLogin', usersControl.simpleLogin);

module.exports = router;