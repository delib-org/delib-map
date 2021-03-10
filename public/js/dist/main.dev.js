"use strict";

var socket = io();
var editBox = document.getElementById('editBox');
var editForm = document.getElementById('editForm');
var linkFav = document.getElementById('linkFav');
var linkFavIcon = document.getElementById('linkFavIcon');
var deleteEdge = document.getElementById('deleteEdge');
editBox.style.display = 'none';
linkFav.addEventListener('click', connectTheNode);
deleteEdge.addEventListener('click', deleteEdgeFn);
var data; //clouser for nodes and edges

function networkStateClouser(_ref) {
  var from = _ref.from,
      to = _ref.to,
      clear = _ref.clear,
      edgeId = _ref.edgeId,
      connect = _ref.connect;
  return function (_ref2) {
    var fromNew = _ref2.fromNew,
        toNew = _ref2.toNew,
        isClear = _ref2.isClear,
        edgeIdNew = _ref2.edgeIdNew,
        connectNew = _ref2.connectNew;
    if (fromNew) from = fromNew;
    if (toNew) to = toNew;
    if (edgeIdNew) edgeId = edgeIdNew;
    if (connectNew !== undefined) connect = connectNew;

    if (isClear) {
      to = null;
      from = null;
    }

    return {
      from: from,
      to: to,
      edgeId: edgeId,
      connect: connect
    };
  };
}

var networkState = networkStateClouser({
  from: null,
  to: null
}); //this is the way to change thenodes clouster
//
// networkState({fromNew:null}); --empty from
// networkState({fromNew:'f'}); -- set new from
// networkState({toNew:'h'}) -- set new to
// networkState({}) -- get current nodes
// networkState({isClear:true}) -- clear all
//events

(function _callee() {
  var mapId, r, _ref3, map, nodes, edges, nodesDS, edgesDS, container, options, network;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //get data from DB
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
              color: {
                border: 'blue',
                background: 'white'
              },
              shape: 'box',
              fixed: false,
              font: '12px arial blue',
              scaling: {
                label: true
              },
              margin: 7,
              shadow: true,
              widthConstraint: 100
            }
          };
          network = new vis.Network(container, data, options); //network events

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
            var nodeId = nodes[0]; //open the edit-box

            editBox.style.display = 'block';
            editBox.style.top = "".concat(pointer.DOM.y + 120, "px");
            editBox.style.left = "".concat(pointer.DOM.x, "px"); //get and set the node label to the form

            var nodeLabel = data.nodes.get(nodeId);
            editForm.children.nodeName.value = nodeLabel.label; // editForm.dataset.nodeId = nodeId;
            // linkFav.dataset.form = nodeId;
            //if connect was pressed, connect the new node

            var _networkState = networkState({}),
                connect = _networkState.connect,
                from = _networkState.from;

            if (connect) {
              //connect to
              networkState({
                toNew: nodeId
              });
              var edgeId = data.edges.add({
                from: from,
                to: nodeId
              })[0]; //send to server

              socket.emit('edge create', {
                mapId: mapId,
                from: from,
                to: nodeId,
                id: edgeId
              });
            } else {
              //set it as a new "from"
              networkState({
                fromNew: nodeId
              });
            }
          });
          network.on('selectEdge', function (e) {
            var edges = e.edges,
                pointer = e.pointer;

            if (edges.length === 1) {
              // handle select one node
              console.log('only on edge was selected'); //hide edit box

              editBox.style.display = 'none'; //show delete button

              var edgeId = edges[0];
              deleteEdge.style.display = 'block';
              deleteEdge.style.top = "".concat(pointer.DOM.y - 10, "px");
              deleteEdge.style.left = "".concat(pointer.DOM.x - 40, "px");
              deleteEdge.dataset.edgeId = edgeId;
              networkState({
                connectNew: false
              });
            } else {
              deleteEdge.style.display = 'none';
            }
          }); //socket events

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
              var _networkState2 = networkState({}),
                  from = _networkState2.from,
                  to = _networkState2.to;

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
})();