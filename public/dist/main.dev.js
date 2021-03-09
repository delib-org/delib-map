"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

console.log('main');
var socket = io();
var data;
renderMap();

function getMapId() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mapId');
}

function renderMap() {
  var _editBox, editForm, mapId, r, _ref, map, nodes, edges, nodesDS, edgesDS, container, options, network;

  return regeneratorRuntime.async(function renderMap$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _editBox = document.getElementById('editBox');
          editForm = document.getElementById('editForm');
          mapId = getMapId();

          if (mapId) {
            _context.next = 6;
            break;
          }

          throw new Error('no map id in URL');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(fetch("/maps/get-map?mapId=".concat(mapId)));

        case 8:
          r = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(r.json());

        case 11:
          _ref = _context.sent;
          map = _ref.map;
          console.log(map);

          if (map) {
            _context.next = 16;
            break;
          }

          throw new Error('DB didnt returned a map');

        case 16:
          nodes = map.nodes, edges = map.edges;
          console.log(nodes, edges); // create an array with nodes

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
            console.log('click');
            var pointer = e.pointer; // console.log(pointer)
            // const pointerEl = document.querySelector('#pointer');
            // pointerEl.style.top = `${pointer.DOM.y}px`;
            // pointerEl.style.left = `${pointer.DOM.x}px`;
            // e.nodes.forEach(node => {
            //     data.nodes.updateOnly({ id: node, label: 'BHHOOMMEEE' })
            // })
          });
          network.on('hold', function (e) {
            console.log(e);
            var edges = e.edges,
                nodes = e.nodes;
            console.log(edges, nodes);

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
          network.on('select', function (e) {
            var nodes = e.nodes,
                pointer = e.pointer;
            console.log(e);
            _editBox.style.display = 'block';
            _editBox.style.top = "".concat(pointer.DOM.y, "px");
            _editBox.style.left = "".concat(pointer.DOM.x, "px");
            var nodeId = nodes[0];
            var nodeLabel = data.nodes.get(nodeId);
            console.dir(editForm);
            editForm.children.nodeName.value = nodeLabel.label;
            editForm.dataset.nodeId = nodeId;
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
          _context.next = 34;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
}

function handleUpdate(e) {
  console.log(e);
  e.preventDefault();
  var nodeName = e.target.children.nodeName.value;
  var nodeId = e.target.dataset.nodeId;
  console.log(nodeId, nodeName);
  console.log(_typeof(nodeName));
  data.nodes.updateOnly({
    id: nodeId,
    label: nodeName
  });
  e.target.reset();
  editBox.style.display = 'none'; //update on other clients
  //get item

  var updatedNode = data.nodes.get(nodeId);
  var mapId = getMapId();
  socket.emit('node update', {
    mapId: mapId,
    updatedNode: updatedNode
  });
}

function createNode(mapId, node) {
  console.log(node);
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
    console.log(data);
  })["catch"](function (e) {
    return console.error(e);
  });
}