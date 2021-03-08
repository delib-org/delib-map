"use strict";

var express = require("express");

var app = express();

var _require = require('./mapSchema'),
    mapSchema = _require.mapSchema;

var mongoose = require('mongoose');

exports.updateNode = function (req, res) {
  res.send({
    ok: true
  });
};

exports.createMap = function _callee(req, res) {
  var creator, mapId, Map, newMap, newMapDB;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          creator = req.username;
          mapId = 'id_' + new Date().getTime();
          Map = mongoose.model('Map', mapSchema);
          newMap = new Map({
            creator: creator,
            mapId: mapId
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(newMap.save());

        case 6:
          newMapDB = _context.sent;
          res.send({
            ok: true,
            newMap: true,
            mapId: mapId,
            creator: creator
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};