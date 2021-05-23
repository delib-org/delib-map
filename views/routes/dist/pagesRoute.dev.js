"use strict";

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
router.get('/contracts', function (req, res) {
  try {
    var user = req.cookies.user;
    res.render('pages/contracts');
  } catch (e) {
    res.redirect('/');
  }
});
router.get('/statements/:contractId', function (req, res) {
  try {
    var user = req.cookies.user;
    var contractId = req.params.contractId;
    res.render('pages/statements', {
      contractId: contractId
    });
  } catch (e) {
    res.redirect('/');
  }
});
module.exports = router;