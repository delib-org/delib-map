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
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            // let url = 'http://ouri-digital-agent.cf/ibc/app/tal';
            // url = encodeURI(url);
            // const r = await fetch(url)
            // const data = await r.json()
            // res.render('pages/contracts',{contracts:data});
            res.render('pages/contracts');
          } catch (e) {
            console.log(e);
            res.redirect('/');
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/statements', function (req, res) {
  try {
    var user = req.cookies.user;
    console.log(req.query);
    var _req$query = req.query,
        contractId = _req$query.contractId,
        agent = _req$query.agent;
    if (!contractId) throw new Error('No contract Id in query');
    if (!agent) throw new Error('No agent in query');
    res.render('pages/statements', {
      contractId: contractId,
      agent: agent
    });
  } catch (e) {
    console.error(e);
    res.redirect('/');
  }
});
module.exports = router;