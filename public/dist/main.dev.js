"use strict";

var socket = io();
var editBox = document.getElementById('editBox');
var editForm = document.getElementById('editForm');
var linkFav = document.getElementById('linkFav');
var linkFavIcon = document.getElementById('linkFavIcon');
var deleteEdge = document.getElementById('deleteEdge');
editBox.style.display = 'none';
linkFav.addEventListener('click', connectNodesEvent);
deleteEdge.addEventListener('click', deleteEdgeFn);
var data;

function connectNodes(_ref) {
  var from = _ref.from,
      to = _ref.to,
      clear = _ref.clear,
      connect = _ref.connect;
  return function (_ref2) {
    var fromNew = _ref2.fromNew,
        toNew = _ref2.toNew,
        isClear = _ref2.isClear,
        connectNew = _ref2.connectNew;
    if (fromNew) from = fromNew;
    if (toNew) to = toNew;
    if (connectNew !== undefined) connect = connectNew;

    if (isClear) {
      to = null;
      from = null;
    }

    return {
      from: from,
      to: to,
      connect: connect
    };
  };
} //clousers


var setConnectNodes = connectNodes({
  from: null,
  to: null
}); //this is the way to change thenodes clouster
//
// setConnectNodes({fromNew:null}); --empty from
// setConnectNodes({fromNew:'f'}); -- set new from
// setConnectNodes({toNew:'h'}) -- set new to
// setConnectNodes({}) -- get current nodes
// setConnectNodes({isClear:true}) -- clear all
//events

renderMap();

function getMapId() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mapId');
}

function renderMap() {
  var mapId, r, _ref3, map, nodes, edges, nodesDS, edgesDS, container, options, network;

  return regeneratorRuntime.async(function renderMap$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          mapId = getMapId();

          if (mapId) {
            _context.next = 4;
            break;
          }

          throw new Error('no mapId in URL');

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("/maps/get-map?mapId=".concat(mapId)));

        case 6:
          r = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(r.json());

        case 9:
          _ref3 = _context.sent;
          map = _ref3.map;

          if (map) {
            _context.next = 13;
            break;
          }

          throw new Error('DB didnt returned a map');

        case 13:
          nodes = map.nodes, edges = map.edges; // create an array with nodes

          nodesDS = new vis.DataSet(nodes); // create an array with edges

          edgesDS = new vis.DataSet(edges); // create a network

          container = document.getElementById("mynetwork");
          data = {
            nodes: nodesDS,
            edges: edgesDS
          };
          options = {
            nodes: {
              color: '#ff0000',
              fixed: false,
              font: '12px arial white',
              scaling: {
                label: true
              },
              shadow: true
            }
          };
          network = new vis.Network(container, data, options);
          network.on('click', function (e) {
            var nodes = e.nodes,
                edges = e.edges; //if clicked on empty screen, hide editBox

            if (edges.length === 0 && nodes.length === 0) {
              editBox.style.display = 'none';
              deleteEdge.style.display = 'none';
            }
          });
          network.on('hold', function (e) {
            var edges = e.edges,
                nodes = e.nodes;

            if (edges.length === 0 && nodes.length === 0) {
              var nodeId = "id".concat(Math.random().toString(16).slice(2));

              var _mapId = getMapId();

              var node = {
                id: nodeId,
                label: 'test'
              };
              data.nodes.add([node]);
              createNode(_mapId, node);
              socket.emit('node create', node);
            }
          });
          network.on('selectNode', function (e) {
            var nodes = e.nodes,
                pointer = e.pointer;
            editBox.style.display = 'block';
            editBox.style.top = "".concat(pointer.DOM.y + 120, "px");
            editBox.style.left = "".concat(pointer.DOM.x, "px");
            var nodeId = nodes[0];
            var nodeLabel = data.nodes.get(nodeId);
            editForm.children.nodeName.value = nodeLabel.label;
            editForm.dataset.nodeId = nodeId;
            linkFav.dataset.form = nodeId;

            var _setConnectNodes = setConnectNodes({}),
                connect = _setConnectNodes.connect,
                from = _setConnectNodes.from;

            if (connect) {
              //connect to
              setConnectNodes({
                toNew: nodeId
              });
              var edgeId = data.edges.add({
                from: from,
                to: nodeId
              })[0];
              socket.emit('edge create', {
                mapId: mapId,
                from: from,
                to: nodeId,
                id: edgeId
              });
            } else {
              //set new from-node
              setConnectNodes({
                fromNew: nodeId
              });
            }

            console.dir(editForm);
          });
          network.on('selectEdge', function (e) {
            var edges = e.edges,
                pointer = e.pointer;
            var edgeId = edges[0];
            deleteEdge.style.display = 'block';
            deleteEdge.style.top = "".concat(pointer.DOM.y - 100, "px");
            deleteEdge.style.left = "".concat(pointer.DOM.x - 40, "px");
            deleteEdge.dataset.edgeId = edgeId;
          });
          socket.on('node update', function (updatedNode) {
            data.nodes.updateOnly({
              id: updatedNode.id,
              label: updatedNode.label
            });
          });
          socket.on('node create', function (node) {
            try {
              data.nodes.add(node);
            } catch (e) {
              console.error(e.message);
            }
          });
          socket.on('edge create', function (edge) {
            try {
              var _setConnectNodes2 = setConnectNodes({}),
                  from = _setConnectNodes2.from,
                  to = _setConnectNodes2.to;

              if (from == edge.from && to === edge.to) {} else {
                data.edges.add(edge);
              }
            } catch (e) {
              console.error(e);
            }
          });
          socket.on('edge delete', function (edgeId) {
            data.edges.remove(edgeId);
          });
          _context.next = 33;
          break;

        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 30]]);
}

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
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    console.info(data);
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