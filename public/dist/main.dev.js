"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

console.log('main');
var socket = io();
renderMap();

function getMapId() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mapId');
}

function renderMap() {
  var _editBox, editForm, mapId, r, map, nodes, edges, container, data, options, network;

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
          map = _context.sent;

          if (map) {
            _context.next = 14;
            break;
          }

          throw new Error('DB didnt returned a map');

        case 14:
          // const {nodes, edges} = map;
          console.log(map); // create an array with nodes

          nodes = new vis.DataSet([{
            id: 1,
            label: "Node 1"
          }, {
            id: 2,
            label: "Node 2"
          }, {
            id: 3,
            label: "Node 3"
          }, {
            id: 4,
            label: "Node 4"
          }, {
            id: 5,
            label: "Node 5"
          }]); // create an array with edges

          edges = new vis.DataSet([{
            from: 1,
            to: 3
          }, {
            from: 1,
            to: 2
          }, {
            from: 2,
            to: 4
          }, {
            from: 2,
            to: 5
          }, {
            from: 3,
            to: 2
          }]); // create a network

          container = document.getElementById("mynetwork");
          data = {
            nodes: nodes,
            edges: edges
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
            console.log(e);
            var pointer = e.pointer; // console.log(pointer)
            // const pointerEl = document.querySelector('#pointer');
            // pointerEl.style.top = `${pointer.DOM.y}px`;
            // pointerEl.style.left = `${pointer.DOM.x}px`;
            // e.nodes.forEach(node => {
            //     data.nodes.updateOnly({ id: node, label: 'BHHOOMMEEE' })
            // })
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
          _context.next = 28;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
}

function handleUpdate(e) {
  console.log(e);
  e.preventDefault();
  var nodeName = e.target.children.nodeName.value;
  var nodeId = parseInt(e.target.dataset.nodeId);
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
  socket.emit('node update', updatedNode);
}

socket.on('node update', function (updatedNode) {
  data.nodes.updateOnly({
    id: updatedNode.id,
    label: updatedNode.label
  });
});