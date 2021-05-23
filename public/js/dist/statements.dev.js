"use strict";

console.log("http://ouri-digital-agent.cf/ibc/app/\u05D0\u05D5\u05E8\u05D9/".concat(contractId, "/get_statements"));
axios.post("http://ouri-digital-agent.cf/ibc/app/\u05D0\u05D5\u05E8\u05D9/".concat(contractId, "/get_statements"), {
  "name": "get_statements",
  "values": {
    "parent": []
  }
}).then(function (_ref) {
  var data = _ref.data;
  console.log(data);
});