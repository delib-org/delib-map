const statements = {selectedNodes:[]};

(async () => {


    const { data } = await axios.post(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/get_statements`, {
        "name": "get_statements",
        "values": { "parent": [] }
    });
    console.log(data)

    convertAllStatments(data);

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
})()

function convertAllStatments(statementsObj) {
    console.log(statementsObj)
    const statments = [];
    const edges = [];
    for (i in statementsObj) {

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
            edges.push({ from: i, to: kid })
        })


    }



    data = {
        nodes: statments,
        edges,
    };

    console.log(data);
    createMap(data);
}

function createMap(data) {
    var container = document.getElementById("mynetwork");

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


    //create new statement
    statements.network.on('hold', e => {
        console.log('hold')

        console.dir(e)

        const { center } = e.event;

        showStatementEditor(center)

    })

    statements.network.on('selectNode', e => {
        console.log('selectNode')
        console.log(e)
        statements.selectedNodes = e.nodes;



    })

    statements.network.on('deselectNode', e => {
        console.log('deselectNode')
        statements.selectedNodes = [];

        console.log(cSt)
    })


}

async function createStatement(text) {
    try {

        if(!Array.isArray(statements.selectedNodes)) throw new Error ('statements.selectedNodes is not array')
        if(typeof text !== 'string') throw new Error ('text is not string')

        const res = await axios.put(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/create_statement`,
            {
                "name": "create_statement",
                "values": { "parents": statements.selectedNodes, "text": text, "tags": ["test"] }
            }
        )
        hideEditStatement()
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



