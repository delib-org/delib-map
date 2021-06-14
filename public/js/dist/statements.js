var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _this = this;
var Statements = /** @class */ (function () {
    function Statements() {
        this._selectedNodes = [];
        this._statementsObj = {};
    }
    Statements.prototype.updateStatements = function (statementsObj) {
        this._statementsObj = __assign(__assign({}, this._statementsObj), statementsObj);
        console.log(this._statementsObj);
    };
    Object.defineProperty(Statements.prototype, "setSelectedNodes", {
        set: function (selectedNodes) {
            try {
                if (Array.isArray(selectedNodes))
                    this._selectedNodes = selectedNodes;
                else
                    throw new Error('the nodes are not an array');
            }
            catch (e) {
                console.error(e);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Statements.prototype, "selectedNodes", {
        get: function () {
            return this._selectedNodes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Statements.prototype, "statementsObj", {
        get: function () {
            return this._statementsObj;
        },
        enumerable: false,
        configurable: true
    });
    return Statements;
}());
var statements = new Statements();
(function () { return __awaiter(_this, void 0, void 0, function () {
    var data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("http://ouri-digital-agent.cf/ibc/app/" + agent + "/" + contractId + "/get_statements", {
                        "name": "get_statements",
                        "values": { "parent": [] }
                    })];
            case 1:
                data = (_a.sent()).data;
                console.log(data);
                statements.updateStatements(data);
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
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
function convertAllStatmentsToMap(statementsObj) {
    console.log(statementsObj);
    var statments = [];
    var edges = [];
    for (i in statementsObj) {
        //transform to vis js semantic
        statementsObj[i].id = i;
        statementsObj[i].label = statementsObj[i].text;
        statments.push(statementsObj[i]);
        var _a = statementsObj[i], parents = _a.parents, kids = _a.kids;
        console.log(parents, kids);
        parents.forEach(function (parent) {
            edges.push({ from: parent, to: i });
        });
        kids.forEach(function (kid) {
            edges.push({ from: i, to: kid.ref });
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
    statements.network = network;
    //create new statement
    statements.network.on('hold', function (e) {
        console.log('hold');
        console.dir(e);
        var center = e.event.center;
        showStatementEditor(center);
    });
    statements.network.on('selectNode', function (e) {
        statements.setSelectedNodes = e.nodes;
        var getKids = confirm('should I get sub statements?');
        if (getKids) {
            getStatement(e.nodes[0]);
        }
    });
    statements.network.on('deselectNode', function (e) {
        try {
            console.log('deselectNode');
            statements.setSelectedNodes = [];
        }
        catch (e) {
            console.error(e);
        }
    });
}
function createStatement(text) {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    hideEditStatement();
                    if (!Array.isArray(statements.selectedNodes))
                        throw new Error('statements.selectedNodes is not array');
                    if (typeof text !== 'string')
                        throw new Error('text is not string');
                    return [4 /*yield*/, axios.put("http://ouri-digital-agent.cf/ibc/app/" + agent + "/" + contractId + "/create_statement", {
                            "name": "create_statement",
                            "values": { "parents": statements.selectedNodes, "text": text, "tags": ["test"] }
                        })];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.error(e_2);
                    hideEditStatement();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function showStatementEditor(center) {
    console.log(center);
    var statementEditor = document.querySelector('#showStatementEditor');
    statementEditor.style.left = center.x + "px";
    statementEditor.style.top = center.y + "px";
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
    }
    catch (e) {
        console.error(e);
    }
}
function getStatement(statmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post("http://ouri-digital-agent.cf/ibc/app/" + agent + "/" + contractId + "/get_statement_dynasty", {
                            "name": "get_statement_dynasty",
                            "values": { "parent": statmentId, "levels": 3 }
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error);
                    console.log(data);
                    statements.updateStatements(data);
                    convertAllStatmentsToMap(statements.statementsObj);
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
