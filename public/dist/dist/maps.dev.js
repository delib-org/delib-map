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