console.log('main');

const socket = io();

let data;

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
        const { map } = await r.json();

        console.log(map)

        if (!map) throw new Error('DB didnt returned a map')

        const { nodes, edges } = map;

        console.log(nodes, edges)

        // create an array with nodes
        var nodesDS = new vis.DataSet(nodes);

        // create an array with edges
        var edgesDS = new vis.DataSet(edges);



        // create a network
        var container = document.getElementById("mynetwork");
        data = {
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
            console.log('click')
            const { pointer } = e;
            // console.log(pointer)

            // const pointerEl = document.querySelector('#pointer');

            // pointerEl.style.top = `${pointer.DOM.y}px`;
            // pointerEl.style.left = `${pointer.DOM.x}px`;

            // e.nodes.forEach(node => {
            //     data.nodes.updateOnly({ id: node, label: 'BHHOOMMEEE' })
            // })


        })

        network.on('hold', e => {
            console.log(e)
            const { edges, nodes } = e;
            console.log(edges, nodes)
            if (edges.length === 0 && nodes.length === 0) {
                const nodeId = `id${Math.random().toString(16).slice(2)}`;
                const mapId = getMapId();
                const node = { id: nodeId, label: 'test' }
                data.nodes.add([node]);

                createNode(mapId, node);
                socket.emit('node create', node)
            }
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

        socket.on('node update', updatedNode => {
            data.nodes.updateOnly({ id: updatedNode.id, label: updatedNode.label });
        })

        socket.on('node create', node => {
            try {
                data.nodes.add(node);
            } catch (e) {

                console.error(e.message)
            }
        })


    } catch (e) {
        console.error(e)
    }
}



function handleUpdate(e) {
    console.log(e)
    e.preventDefault();

    const nodeName = e.target.children.nodeName.value;
    const nodeId = e.target.dataset.nodeId;

    console.log(nodeId, nodeName);
    console.log(typeof nodeName)

    data.nodes.updateOnly({ id: nodeId, label: nodeName });
    e.target.reset();
    editBox.style.display = 'none';

    //update on other clients
    //get item
    let updatedNode = data.nodes.get(nodeId);
    const mapId = getMapId();

    socket.emit('node update', { mapId, updatedNode })

}



function createNode(mapId, node) {
    console.log(node)
    fetch('/maps/createNode', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mapId, node })
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
        })
        .catch(e => console.error(e))
}