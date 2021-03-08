"use strict";

// const express = require("express");
// const app = express();
exports.simpleLogin = function (req, res) {
  try {
    var _req$body = req.body,
        loginName = _req$body.loginName,
        mapId = _req$body.mapId;
    console.log('mapId:', mapId);

    if (loginName) {
      res.cookie('user', loginName);
      res.send({
        ok: true,
        mapId: mapId
      });
    } else {
      res.send({
        ok: false,
        error: "no user name"
      });
    }
  } catch (e) {
    console.log(e);
    res.send({
      ok: false,
      error: e.message
    });
  }
};