console.log('main');

const socket = io();

renderMap();

function getMapId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mapId');
}

async function renderMap() {
    try {
        const editBox = document.getElementById('editBox');
        const editForm = document.getElementById('editForm');

        const mapId = getMapId();
        if (!mapId) throw new Error('no map id in URL')

        const r = await fetch(`/maps/get-map?mapId=${mapId}`);
        const map = await r.json()

        if(!map) throw new Error('DB didnt returned a map')

        // const {nodes, edges} = map;

        console.log(map)

        // create an array with nodes
        var nodes = new vis.DataSet([
            { id: 1, label: "Node 1" },
            { id: 2, label: "Node 2" },
            { id: 3, label: "Node 3" },
            { id: 4, label: "Node 4" },
            { id: 5, label: "Node 5" },
        ]);

        // create an array with edges
        var edges = new vis.DataSet([
            { from: 1, to: 3 },
            { from: 1, to: 2 },
            { from: 2, to: 4 },
            { from: 2, to: 5 },
            { from: 3, to: 2 },
        ]);



        // create a network
        var container = document.getElementById("mynetwork");
        var data = {
            nodes: nodes,
            edges: edges,
        };
        const options = {
            nodes: {
                color: '#ff0000',
                fixed: false,
                font: '12px arial white',
                scaling: {
                    label: true
                },
                shadow: true
            }
        }
        const network = new vis.Network(container, data, options);


        network.on('click', e => {
            console.log(e)
            const { pointer } = e;
            // console.log(pointer)

            // const pointerEl = document.querySelector('#pointer');

            // pointerEl.style.top = `${pointer.DOM.y}px`;
            // pointerEl.style.left = `${pointer.DOM.x}px`;

            // e.nodes.forEach(node => {
            //     data.nodes.updateOnly({ id: node, label: 'BHHOOMMEEE' })
            // })


        })



        network.on('select', e => {
            const { nodes, pointer } = e;
            console.log(e)

            editBox.style.display = 'block'

            editBox.style.top = `${pointer.DOM.y}px`;
            editBox.style.left = `${pointer.DOM.x}px`;


            const nodeId = nodes[0];

            const nodeLabel = data.nodes.get(nodeId)

            console.dir(editForm)

            editForm.children.nodeName.value = nodeLabel.label;
            editForm.dataset.nodeId = nodeId


        })
    } catch (e) {
        console.error(e)
    }
}



function handleUpdate(e) {
    console.log(e)
    e.preventDefault();

    const nodeName = e.target.children.nodeName.value;
    const nodeId = parseInt(e.target.dataset.nodeId);

    console.log(nodeId, nodeName);
    console.log(typeof nodeName)

    data.nodes.updateOnly({ id: nodeId, label: nodeName });
    e.target.reset();
    editBox.style.display = 'none';

    //update on other clients
    //get item
    let updatedNode = data.nodes.get(nodeId);

    socket.emit('node update', updatedNode)

}

socket.on('node update', updatedNode => {
    data.nodes.updateOnly({ id: updatedNode.id, label: updatedNode.label });
})