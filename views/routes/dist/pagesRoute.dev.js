"use strict";

var fetch = require('node-fetch');

var router = require("express").Router(); // index page


router.get('', function (req, res) {
  res.render('pages/index');
}); // about page

router.get('/about', function (req, res) {
  res.render('pages/about');
});
router.get('/login', function (req, res) {
  var mapId = req.query.mapId;
  res.render('pages/login', {
    mapId: mapId
  });
});
router.get('/map', function (req, res) {
  var user = req.cookies.user;
  var mapId = req.query.mapId;

  if (user) {
    //db
    res.render('pages/map', {
      mapId: mapId
    });
  } else {
    res.redirect("/login?mapId=".concat(mapId));
  }
});
router.get('/maps', function (req, res) {
  try {
    var user = req.cookies.user;
    res.render('pages/maps');
  } catch (e) {
    res.redirect('/');
  }
});
router.get('/contracts', function _callee(req, res) {
  var url, r, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = 'http://ouri-digital-agent.cf/ibc/app/אורי';
          url = encodeURI(url);
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch(url));

        case 5:
          r = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(r.json());

        case 8:
          data = _context.sent;
          res.render('pages/contracts', {
            contracts: data
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.redirect('/');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get('/statements', function (req, res) {
  try {
    var user = req.cookies.user;
    var contractId = req.query.contractId;
    if (!contractId) throw new Error('No contract Id in query');
    res.render('pages/statements', {
      contractId: contractId
    });
  } catch (e) {
    console.error(e);
    res.redirect('/');
  }
});
module.exports = router;