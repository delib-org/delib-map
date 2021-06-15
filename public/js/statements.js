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





