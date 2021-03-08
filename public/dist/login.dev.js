"use strict";

function handleLogin(mapId) {
  try {
    var loginName = document.getElementById('loginSimple').value;
    console.log('login', loginName, mapId);

    if (loginName) {
      fetch('/users/simpleLogin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loginName: loginName,
          mapId: mapId
        })
      }).then(function (r) {
        return r.json();
      }).then(function (_ref) {
        var mapId = _ref.mapId,
            ok = _ref.ok;

        if (mapId) {
          window.location.replace("/map?mapId=".concat(mapId));
        }
      })["catch"](function (e) {
        return console.error(e);
      });
    }
  } catch (e) {
    console.error(e);
  }
}