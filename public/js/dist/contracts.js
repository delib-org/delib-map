var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Agents = /** @class */ (function () {
    function Agents() {
        this.agents = [];
        this._selectedAgent = '';
        this.getAgents = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios.get('http://ouri-digital-agent.cf/ibc/app')];
                        case 1:
                            data = (_a.sent()).data;
                            if (!Array.isArray(data)) {
                                console.error(data);
                                throw new Error('server respond with non array agents');
                            }
                            this.agents = data;
                            this.renderAgents();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
    }
    Agents.prototype.selectedAgent = function (agent) {
        if (agent === void 0) { agent = false; }
        if (!agent)
            return this._getSelectedAgent();
        else
            return this._SetselectedAgent(agent);
    };
    Object.defineProperty(Agents.prototype, "setSelectedAgent", {
        set: function (agent) {
            try {
                this._selectedAgent = agent;
            }
            catch (e) {
                console.error(e);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agents.prototype, "getSelectedAgent", {
        get: function () {
            return this._selectedAgent;
        },
        enumerable: false,
        configurable: true
    });
    Agents.prototype.renderAgents = function () {
        try {
            var agentsRoot = document.getElementById('agents');
            var html_1 = '<option selected disabled>Choose an agent</option>';
            this.agents.forEach(function (agent) {
                html_1 += "<option value='" + agent + "' onchange='getContracts(\"" + agent + "\")'>" + agent + "</option>";
            });
            agentsRoot.innerHTML = html_1;
        }
        catch (e) {
            console.error(e);
        }
    };
    return Agents;
}());
var agents = new Agents();
agents.getAgents();
function getContracts(ev) {
    return __awaiter(this, void 0, void 0, function () {
        var agent, data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    agent = ev.target.value;
                    if (!agent)
                        throw new Error('no agent');
                    agents.setSelectedAgent = agent;
                    return [4 /*yield*/, axios.get("http://ouri-digital-agent.cf/ibc/app/" + agent)];
                case 1:
                    data = (_a.sent()).data;
                    console.log(data);
                    renderContracts(data);
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function renderContracts(contracts) {
    var contractsRoot = document.querySelector('#contractsRoot');
    var selectedAgent = agents.getSelectedAgent;
    var html = '';
    contracts.forEach(function (contract) {
        html += "<div class='card contracts__contract' ><a href='/statements?agent=" + selectedAgent + "&contractId=" + contract.name + "'>Contract: " + contract.name + "</a></div>";
    });
    contractsRoot.innerHTML = html;
}
