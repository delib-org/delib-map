class Statements {

    constructor(){
        this.data={}
    }
    _selectedNodes = [];

    _statementsObj = {};
    data= {};

    updateStatements(statementsObj){
        this._statementsObj = {...this._statementsObj,...statementsObj};
        console.log(this._statementsObj)
    }

    showAddButton(statementId){
        console.log('adding')
        this.data.nodes.add({id:"add", shape:'icon', 
        color:{
            background:'#ffffff'
        },
        physics:false,
        icon:{
            face:'FontAwesome',
            code:'\uf055',
            size:32
        }})
        this.data.edges.add({
            id:'add', 
            from:statementId, 
            to:'add',
            physics:false,
            length:60,
            smoth:{
                type:'cubicBezier'
            }
        })
    }

    convertAllStatmentsToMap(statementsObj) {

    
        console.log(statementsObj)
        const statments = [];
        const edges = [];
        for (let i in statementsObj) {
    
            //transform to vis js semantic
            statementsObj[i].id = i;
            statementsObj[i].label = statementsObj[i].text;
            statments.push(statementsObj[i]);
    
            const { parents, kids } = statementsObj[i];
            console.log(parents, kids)
            parents.forEach(parent => {
                edges.push({ from: parent, to: i });
            })
            kids.forEach(kid => {
                edges.push({ from: i, to: kid.ref })
            })
    
    
        }
    
    
    
        this.data = {
            nodes: new vis.DataSet(statments),
            edges:new vis.DataSet(edges)
        };
    
        console.log(this.data);
        createMap(this.data);
    }

    set setSelectedNodes(selectedNodes) {
        try {
            if (Array.isArray(selectedNodes)) this._selectedNodes = selectedNodes;
            else throw new Error('the nodes are not an array')

        } catch (e) {
            console.error(e)
        }
    }

    get selectedNodes() {
        return this._selectedNodes;
    }

    get statementsObj(){
        return this._statementsObj;
    }


}

const statements = new Statements();


(async () => {

    try {
        //get all statments
        const { data } = await axios.post(`http://ouri-digital-agent.cf/ibc/app/${agent}/${contractId}/get_statements`, {
            "name": "get_statements",
            "values": { "parent": [] }
        });
        console.log(data)

        statements.updateStatements(data);

        statements.convertAllStatmentsToMap(data);

        document.addEventListener('keyup', e => {
            const key = e.code;

            switch (key) {
                case 'Tab':
                    //check if a node is pressed. if yes, create new node with parent of the selected node

                    if (statements.selectedNodes.length > 0) {
                        //get current location
                        const firstStatement = statements.selectedNodes[0];
                        let center = statements.network.getPosition(firstStatement);

                        center = statements.network.canvasToDOM(center);
                        center.x = center.x + 150;
                        center.y = center.y - 150;
                        showStatementEditor(center)
                    }

                    break
                default:
            }
        })
    } catch (e) {
        console.error(e)
    }
})();

function createMap(data) {
    const container = document.getElementById("mynetwork");

    const options = {
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
            widthConstraint: 150,
        }
    }
    const network = new vis.Network(container, data, options);

    statements.network = network;


    //events on network
    statements.network.on('hold', e => {
        console.log('hold')

        console.dir(e)

        const { center } = e.event;

        showStatementEditor(center)

    })

    statements.network.on('selectNode', e => {
        console.log(e)

        statements.setSelectedNodes = e.nodes;

        // let getKids = confirm('should I get sub statements?')
        // if (getKids) { 
        //     getStatement(e.nodes[0]);
        // }
        console.log(statements.selectedNodes);

        statements.showAddButton(statements.selectedNodes[0]);

        //add temprary node


    })

    statements.network.on('deselectNode', e => {
        try {
            console.log('deselectNode')
            statements.setSelectedNodes = [];
        } catch (e) {
            console.error(e);
        }


    })


}

async function createStatement(text) {
    try {

        hideEditStatement();

        if (!Array.isArray(statements.selectedNodes)) throw new Error('statements.selectedNodes is not array')
        if (typeof text !== 'string') throw new Error('text is not string')

        const res = await axios.put(`http://ouri-digital-agent.cf/ibc/app/${agent}/${contractId}/create_statement`,
            {
                "name": "create_statement",
                "values": { "parents": statements.selectedNodes, "text": text, "tags": ["test"] }
            }
        )

        console.log(res)
    } catch (e) {
        console.error(e);
        hideEditStatement()
    }
}

function showStatementEditor(center) {
    console.log(center)
    const statementEditor = document.querySelector('#showStatementEditor');
    statementEditor.style.left = `${center.x}px`;
    statementEditor.style.top = `${center.y}px`;
    statementEditor.style.display = 'block';
}

function hideEditStatement() {
    const statementEditor = document.querySelector('#showStatementEditor');

    statementEditor.style.display = 'none';
}

function updateStatement(e) {
    e.preventDefault();
    try {
        const text = e.target.children.text.value;
        if (text) {
            createStatement(text);
            e.target.reset();
        }
    } catch (e) {
        console.error(e)
    }
}

async function getStatement(statmentId) {
    try {

        const {data, error} = await axios.post(`http://ouri-digital-agent.cf/ibc/app/${agent}/${contractId}/get_statement_dynasty`,
            {
                "name": "get_statement_dynasty",
                "values": { "parent": statmentId, "levels": 3 }
            }
        )
        if(error) throw new Error(error);

        console.log(data);
        statements.updateStatements(data);
        statements.convertAllStatmentsToMap(statements.statementsObj)

    } catch (e) {

    }
}



