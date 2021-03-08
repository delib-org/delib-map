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
  console.log('creating map');
  fetch('/maps/createMap', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    return console.log(data);
  });
}