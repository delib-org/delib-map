const fetch = require('node-fetch');
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

router.get('/contracts', async (req, res) => {
    try {
        // let url = 'http://ouri-digital-agent.cf/ibc/app/tal';
        // url = encodeURI(url);
        // const r = await fetch(url)
        // const data = await r.json()

        // res.render('pages/contracts',{contracts:data});
        res.render('pages/contracts');


    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
});

router.get('/statements', function (req, res) {

    try {
        const user = req.cookies.user;
        console.log(req.query)
        const {contractId, agent} = req.query;

        if (!contractId) throw new Error('No contract Id in query');
        if (!agent) throw new Error('No agent in query')

        res.render('pages/statements', { contractId, agent});
    } catch (e) {
        console.error(e)
        res.redirect('/')
    }
});



module.exports = router;