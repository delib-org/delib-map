"use strict";

var mapsRoot = document.getElementById('mapsRoot');

function renderMaps(maps) {
  var html = '';
  maps.forEach(function (map) {
    console.log(map);
    html += "<p><a href=\"/map?mapId=".concat(map._id, "\">Map: ").concat(map.name, "</a></p>");
  });
  mapsRoot.innerHTML = html;
}

function renderNewMap(map) {
  var beforeHtml = mapsRoot.innerHTML;
  html = "<p><a href=\"/map?mapId=".concat(map._id, "\">map name: ").concat(map.name, "</a></p>") + beforeHtml;
  mapsRoot.innerHTML = html;
}

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

function getMaps() {
  fetch('/maps/get-all-maps').then(function (r) {
    return r.json();
  }).then(function (_ref) {
    var maps = _ref.maps;

    if (maps) {
      renderMaps(maps);
    }
  });
}

getMaps();