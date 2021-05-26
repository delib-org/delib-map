"use strict";

// fetch('http://ouri-digital-agent.cf/ibc/app/אורי')
//     .then(r => r.json())
//     .then(data => {
//         console.log(data)
//         renderContracts(data)
//     })
function renderContracts(contracts) {
  var contractsRoot = document.querySelector('#contractsRoot');
  var html = '';
  contracts.forEach(function (contract) {
    html += "<div class='card contracts__contract' ><a href='/statements?contractId=".concat(contract.name, "'>").concat(contract.name, "</a></div>");
  });
  contractsRoot.innerHTML = html;
}