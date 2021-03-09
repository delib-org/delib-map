"use strict";

function handleUpdate(e) {
  e.preventDefault();
  var nodeName = document.getElementById('nodeName').value;
  var nodeId = editForm.dataset.nodeId;
  data.nodes.updateOnly({
    id: nodeId,
    label: nodeName
  });
  document.getElementById('nodeName').value = '';
  editBox.style.display = 'none'; //update on other clients
  //get item

  var updatedNode = data.nodes.get(nodeId);
  var mapId = getMapId();
  socket.emit('node update', {
    mapId: mapId,
    updatedNode: updatedNode
  });
}

function closeEditBox(e) {
  e.stopPropagation();
  var icon = document.getElementById('linkFavIcon');
  var iconText = icon.innerText;
  icon.innerText = 'link';
  linkFav.style.background = 'var(--gray2)';
  console.dir(setConnectNodes({
    isClear: true
  }));
  editBox.style.display = 'none';
}

function createNode(mapId, node) {
  fetch('/maps/createNode', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mapId: mapId,
      node: node
    })
  })["catch"](function (e) {
    return console.error(e);
  });
}

function connectNodesEvent(e) {
  e.stopPropagation();
  var icon = document.getElementById('linkFavIcon');
  var iconText = icon.innerText;

  if (iconText == 'link') {
    icon.innerText = 'link_off';
    linkFav.style.background = 'var(--accent)';
    console.dir(setConnectNodes({
      connectNew: true
    }));
  } else {
    icon.innerText = 'link';
    linkFav.style.background = 'var(--gray2)';
    console.dir(setConnectNodes({
      connectNew: false
    }));
  }
}

function deleteEdgeFn(e) {
  e.stopPropagation();
  var edgeId = deleteEdge.dataset.edgeId;
  var mapId = getMapId();
  deleteEdge.style.display = 'none';
  socket.emit('edge delete', {
    mapId: mapId,
    edgeId: edgeId
  });
}

function getMapId() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mapId');
}