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
  var creator, newMapName, _Map, newMap, newMapDB, mapId;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('creating');
          creator = req.username;
          newMapName = req.body.newMapName;

          if (newMapName) {
            _context.next = 6;
            break;
          }

          throw new Error('no name in the req');

        case 6:
          _Map = mongoose.model('Map', mapSchema);
          newMap = new _Map({
            creator: creator,
            name: newMapName,
            creationDate: Date.now()
          });
          _context.next = 10;
          return regeneratorRuntime.awrap(newMap.save());

        case 10:
          newMapDB = _context.sent;
          mapId = newMapDB._id;
          res.send({
            ok: true,
            newMap: true,
            creator: creator,
            mapId: mapId,
            name: newMapName
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.send({
            error: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};