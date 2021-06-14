"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Agents = function Agents() {
  _classCallCheck(this, Agents);
};

getAgents();

function getAgents() {
  var _ref, date;

  return regeneratorRuntime.async(function getAgents$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(axios.get('http://ouri-digital-agent.cf/ibc/app'));

        case 2:
          _ref = _context.sent;
          date = _ref.date;
          console.log(data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function renderContracts(contracts) {
  var contractsRoot = document.querySelector('#contractsRoot');
  var html = '';
  contracts.forEach(function (contract) {
    html += "<div class='card contracts__contract' ><a href='/statements?contractId=".concat(contract.name, "'>").concat(contract.name, "</a></div>");
  });
  contractsRoot.innerHTML = html;
}