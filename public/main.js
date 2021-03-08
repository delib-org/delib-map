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
        const {map} = await r.json()

        if(!map) throw new Error('DB didnt returned a map')

        const {nodes, edges} = map;

        console.log(nodes, edges)

        // create an array with nodes
        var nodesDS = new vis.DataSet(nodes);

        // create an array with edges
        var edgesDS = new vis.DataSet(edges);



        // create a network
        var container = document.getElementById("mynetwork");
        var data = {
            nodes: nodesDS,
            edges: edgesDS,
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