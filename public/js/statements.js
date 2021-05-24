function state(info) {
    let { network } = info
    function inFun() {
        return { network }
    }
    return { network }
}

(async () => {


    const { data } = await axios.post(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/get_statements`, {
        "name": "get_statements",
        "values": { "parent": [] }
    })
    console.log(data)

    convertAllStatments(data);
})()

function convertAllStatments(statementsObj) {
    const statments = [];
    const edges = [];
    for (i in statementsObj) {

        //transform to vis js semantic
        statementsObj[i].id = i;
        statementsObj[i].label = statementsObj[i].text;
        statments.push(statementsObj[i]);

        const { parents, kids } = statementsObj[i];
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

    //create new statement
    network.on('hold', e => {
        console.log('hold')

        console.dir(e)

        const { center } = e.event;

        showStatementEditor(center)

        // const { edges, nodes } = e;

        // if (edges.length === 0 && nodes.length === 0) {
        //     const nodeId = `id${Math.random().toString(16).slice(2)}`;
        //     // const mapId = getMapId();
        //     const node = { id: nodeId, label: 'add text' }
        //     data.nodes.add([node]);

        //     createNode(mapId, node);
        //     // socket.emit('node create', node)
        // }
    })

    console.log(state({ network }))
}

async function createNode(text) {

    const res = axios.put(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/create_statement`,
        {
            "name": "create_statement",
            "values": { "parents": [], "text": text, "tags": ["test"] }
        }
    )

    console.log(res)
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
            createNode(text);
            e.target.reset();
        }
    } catch (e) {
        console.error(e)
    }


}

