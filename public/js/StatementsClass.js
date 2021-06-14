class Statements {

    constructor() {
        this.data = {}
    }
    _selectedNodes = [];

    _statementsObj = {};
    data = {};

    updateStatements(statementsObj) {
        this._statementsObj = { ...this._statementsObj, ...statementsObj };
        console.log(this._statementsObj)
    }

    showAddButton(statementId) {
        if (statementId !== 'add') {
            this.data.nodes.add({
                id: "add", 
                shape: 'icon',
                icon: {
                    face: 'FontAwesome',
                    code: '\uf055',
                    size: 32
                }
            })
            this.data.edges.add({
                id: 'add',
                from: statementId,
                to: 'add',
                length: 60,
                smoth: {
                    type: 'cubicBezier',
                    forceDirection:['horizontal']
                }
            })
        }
    }

    removeAddButton() {
        this.data.nodes.remove('add');
        this.data.edges.remove('add')
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
            edges: new vis.DataSet(edges)
        };

        console.log(this.data);
        this.createMap(this.data);
    }

    createMap(data) {
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
        this.network = new vis.Network(container, data, options);




        //events on network
        this.network.on('hold', e => {
            console.log('hold')

            console.dir(e)

            const { center } = e.event;

            showStatementEditor(center);

        })

        this.network.on('selectNode', e => {
            console.log(e)
            const { center } = e.event;
            statements.setSelectedNodes = e.nodes;

            // let getKids = confirm('should I get sub statements?')
            // if (getKids) { 
            //     getStatement(e.nodes[0]);
            // }
            console.log(statements.selectedNodes);
            if(statements.selectedNodes[0] === 'add'){
                showStatementEditor(center);
            } else {
                statements.showAddButton(statements.selectedNodes[0]);
            }

            

            //add temprary node


        })

        this.network.on('deselectNode', e => {
            try {
                console.log('deselectNode')
                statements.setSelectedNodes = [];
                statements.removeAddButton(statements.selectedNodes[0]);
            } catch (e) {
                console.error(e);
            }


        })


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

    get statementsObj() {
        return this._statementsObj;
    }


}