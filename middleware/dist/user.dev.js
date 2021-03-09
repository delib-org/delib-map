"use strict";

exports.username = function (req, res, next) {
  var user = req.cookies.user;

  var _JSON$parse = JSON.parse(user),
      username = _JSON$parse.username;

  console.log('username:', username);
  req.username = username;
  next();
};