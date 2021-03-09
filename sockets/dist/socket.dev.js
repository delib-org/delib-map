"use strict";

var _require = require('../index'),
    io = _require.io;

var mongoose = require('mongoose');

var _require2 = require('../routes/maps/mapSchema'),
    mapSchema = _require2.mapSchema;

var Map = mongoose.model('Map', mapSchema);
io.on('connection', function (socket) {
  console.log('connection');
  socket.on('node update', function _callee(mapObj) {
    var mapId, updatedNode, map;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mapId = mapObj.mapId, updatedNode = mapObj.updatedNode;
            io.emit('node update', updatedNode);
            _context.next = 4;
            return regeneratorRuntime.awrap(Map.updateOne({
              'nodes._id': updatedNode._id
            }, {
              $set: {
                'nodes.$': updatedNode
              }
            }, {
              arrayFilters: [{
                'nodes.id': updatedNode.id
              }]
            }));

          case 4:
            map = _context.sent;

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  socket.on('node create', function (node) {
    console.log('node create');
    io.emit('node create', node);
  });
  socket.on('edge create', function _callee2(edge) {
    var mapId, map;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            mapId = edge.mapId;
            _context2.next = 4;
            return regeneratorRuntime.awrap(Map.updateOne({
              _id: mapId
            }, {
              $push: {
                edges: edge
              }
            }));

          case 4:
            map = _context2.sent;
            io.emit('edge create', edge);
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 8]]);
  });
  socket.on('edge delete', function _callee3(_ref) {
    var mapId, edgeId, map;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mapId = _ref.mapId, edgeId = _ref.edgeId;
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap(Map.updateOne({
              'edges.id': edgeId
            }, {
              $pull: {
                edges: {
                  id: edgeId
                }
              }
            }, {
              multi: false
            }));

          case 4:
            map = _context3.sent;
            io.emit('edge delete', edgeId);
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
});