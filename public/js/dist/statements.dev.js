"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Statements = function Statements() {
  _classCallCheck(this, Statements);
};

var statements = {
  selectedNodes: []
};

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
          convertAllStatmentsToMap(data);
          document.addEventListener('keyup', function (e) {
            var key = e.code;

            switch (key) {
              case 'Tab':
                //check if a node is pressed. if yes, create new node with parent of the selected node
                if (statements.selectedNodes.length > 0) {
                  //get current location
                  var firstStatement = statements.selectedNodes[0];
                  var center = statements.network.getPosition(firstStatement);
                  center = statements.network.canvasToDOM(center);
                  center.x = center.x + 150;
                  center.y = center.y - 150;
                  showStatementEditor(center);
                }

                break;

              default:
            }
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
})();

function convertAllStatmentsToMap(statementsObj) {
  console.log(statementsObj);
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
    console.log(parents, kids);
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
  var network = new vis.Network(container, data, options);
  statements.network = network; //create new statement

  statements.network.on('hold', function (e) {
    console.log('hold');
    console.dir(e);
    var center = e.event.center;
    showStatementEditor(center);
  });
  statements.network.on('selectNode', function (e) {
    console.log('selectNode');
    console.log(e);
    statements.selectedNodes = e.nodes;
  });
  statements.network.on('deselectNode', function (e) {
    console.log('deselectNode');
    statements.selectedNodes = [];
    console.log(cSt);
  });
}

function createStatement(text) {
  var res;
  return regeneratorRuntime.async(function createStatement$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          hideEditStatement();

          if (Array.isArray(statements.selectedNodes)) {
            _context2.next = 4;
            break;
          }

          throw new Error('statements.selectedNodes is not array');

        case 4:
          if (!(typeof text !== 'string')) {
            _context2.next = 6;
            break;
          }

          throw new Error('text is not string');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(axios.put("http://ouri-digital-agent.cf/ibc/app/\u05D0\u05D5\u05E8\u05D9/".concat(contractId, "/create_statement"), {
            "name": "create_statement",
            "values": {
              "parents": statements.selectedNodes,
              "text": text,
              "tags": ["test"]
            }
          }));

        case 8:
          res = _context2.sent;
          console.log(res);
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          hideEditStatement();

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
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
      createStatement(text);
      e.target.reset();
    }
  } catch (e) {
    console.error(e);
  }
}