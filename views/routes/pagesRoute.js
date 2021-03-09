const router = require("express").Router();

// index page
router.get('', function (req, res) {
    res.render('pages/index');
});

// about page
router.get('/about', function (req, res) {
    res.render('pages/about');
});



router.get('/login', function (req, res) {

    const { mapId } = req.query;

    res.render('pages/login', { mapId });
});


router.get('/map', function (req, res) {

    const user = req.cookies.user;

    const { mapId } = req.query;

    if (user) {
        //db
        res.render('pages/map', { mapId });
    } else {
        res.redirect(`/login?mapId=${mapId}`);
    }


});

router.get('/maps', function (req, res) {
    try {
        const user = req.cookies.user;

        res.render('pages/maps',);
    } catch (e) {
        res.redirect('/')
    }
});


module.exports = router;