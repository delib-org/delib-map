"use strict";

var maps = [{
  mapId: 1,
  name: 'first map'
}, {
  mapId: 2,
  name: 'second map'
}];
var mapsRoot = document.getElementById('mapsRoot');
var html = '';
maps.forEach(function (map) {
  console.log(map);
  html += "<p>map name: ".concat(map.name, "</p>");
});
mapsRoot.innerHTML = html;

function handleCreateMap() {
  try {
    console.log('creating map');
    var newMapName = document.getElementById('newMapName').value;

    if (newMapName) {
      fetch('/maps/createMap', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newMapName: newMapName
        })
      }).then(function (r) {
        return r.json();
      }).then(function (data) {
        console.log(data);
        var mapId = data.mapId;

        if (mapId) {
          window.location.replace("/map?mapId=".concat(mapId));
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}