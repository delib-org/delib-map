"use strict";

function state(info) {
  var network = info.network;

  function inFun() {
    return {
      network: network
    };
  }

  return {
    network: network
  };
}

(function _callee() {
  var _ref, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(axios.post("http://ouri-digital-agent.cf/ibc/app/\u05D0\u05D5\u05E8\u05D9/".concat(contractId, "/get_statements"), {
            "name": "get_statements",
            "values": {
              "parent": []
            }
          }));

        case 2:
          _ref = _context.sent;
          data = _ref.data;
          console.log(data);
          convertAllStatments(data);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
})();

function convertAllStatments(statementsObj) {
  var statments = [];
  var edges = [];

  for (i in statementsObj) {
    //transform to vis js semantic
    statementsObj[i].id = i;
    statementsObj[i].label = statementsObj[i].text;
    statments.push(statementsObj[i]);
    var _statementsObj$i = statementsObj[i],
        parents = _statementsObj$i.parents,
        kids = _statementsObj$i.kids;
    parents.forEach(function (parent) {
      edges.push({
        from: parent,
        to: i
      });
    });
    kids.forEach(function (kid) {
      edges.push({
        from: i,
        to: kid
      });
    });
  }

  data = {
    nodes: statments,
    edges: edges
  };
  console.log(data);
  createMap(data);
}

function createMap(data) {
  var container = document.getElementById("mynetwork");
  var options = {
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
      margin: 4,
      shadow: true,
      widthConstraint: 150
    }
  };
  var network = new vis.Network(container, data, options); //create new statement

  network.on('hold', function (e) {
    console.log('hold');
    console.dir(e);
    var center = e.event.center;
    showStatementEditor(center); // const { edges, nodes } = e;
    // if (edges.length === 0 && nodes.length === 0) {
    //     const nodeId = `id${Math.random().toString(16).slice(2)}`;
    //     // const mapId = getMapId();
    //     const node = { id: nodeId, label: 'add text' }
    //     data.nodes.add([node]);
    //     createNode(mapId, node);
    //     // socket.emit('node create', node)
    // }
  });
  console.log(state({
    network: network
  }));
}

function createNode(text) {
  var res;
  return regeneratorRuntime.async(function createNode$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res = axios.put("http://ouri-digital-agent.cf/ibc/app/\u05D0\u05D5\u05E8\u05D9/".concat(contractId, "/create_statement"), {
            "name": "create_statement",
            "values": {
              "parents": [],
              "text": text,
              "tags": ["test"]
            }
          });
          console.log(res);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function showStatementEditor(center) {
  console.log(center);
  var statementEditor = document.querySelector('#showStatementEditor');
  statementEditor.style.left = "".concat(center.x, "px");
  statementEditor.style.top = "".concat(center.y, "px");
  statementEditor.style.display = 'block';
}

function hideEditStatement() {
  var statementEditor = document.querySelector('#showStatementEditor');
  statementEditor.style.display = 'none';
}

function updateStatement(e) {
  e.preventDefault();

  try {
    var text = e.target.children.text.value;

    if (text) {
      createNode(text);
      e.target.reset();
    }
  } catch (e) {
    console.error(e);
  }
}