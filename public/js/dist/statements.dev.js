"use strict";

window.onload = function () {
  $(function () {
    if (window.location.protocol === "https:") window.location.protocol = "http";
  });
};

var statements = new Statements();

(function _callee() {
  var _ref, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.post("http://ouri-digital-agent.cf/ibc/app/".concat(agent, "/").concat(contractId, "/get_statements"), {
            "name": "get_statements",
            "values": {
              "parent": []
            }
          }));

        case 3:
          _ref = _context.sent;
          data = _ref.data;
          console.log(data);
          statements.updateStatements(data);
          statements.convertAllStatmentsToMap(data);
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
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
})();

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
          return regeneratorRuntime.awrap(axios.put("http://ouri-digital-agent.cf/ibc/app/".concat(agent, "/").concat(contractId, "/create_statement"), {
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