

exports.simpleLogin = (req, res) => {
    try {
        const { loginName, mapId } = req.body;

        console.log('mapId:', mapId)

        if (loginName) {
            res.cookie('user', JSON.stringify({username: loginName}));

            res.send({ ok: true, mapId });

        } else {

            res.send({ ok: false, error: "no user name" });
        }
    } catch (e) {
        console.log(e);
        res.send({ ok: false, error: e.message });
    }


};