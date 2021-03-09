const socket = io();

const editBox = document.getElementById('editBox');
const editForm = document.getElementById('editForm');
const linkFav = document.getElementById('linkFav');
const linkFavIcon = document.getElementById('linkFavIcon');
const deleteEdge = document.getElementById('deleteEdge');
editBox.style.display = 'none'

linkFav.addEventListener('click', connectNodesEvent)
deleteEdge.addEventListener('click', deleteEdgeFn);


let data;

function connectNodes({ from, to, clear, connect }) {
    return function ({ fromNew, toNew, isClear, connectNew }) {

        if (fromNew) from = fromNew;
        if (toNew) to = toNew;
        if (connectNew !== undefined) connect = connectNew;

        if (isClear) {
            to = null;
            from = null;
        }

        return { from, to, connect }
    }

}

//clousers

const setConnectNodes = connectNodes({ from: null, to: null });

//this is the way to change thenodes clouster
//
// setConnectNodes({fromNew:null}); --empty from
// setConnectNodes({fromNew:'f'}); -- set new from
// setConnectNodes({toNew:'h'}) -- set new to
// setConnectNodes({}) -- get current nodes
// setConnectNodes({isClear:true}) -- clear all

//events



renderMap();

function getMapId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mapId');
}

async function renderMap() {
    try {


        const mapId = getMapId();
        if (!mapId) throw new Error('no mapId in URL')

        const r = await fetch(`/maps/get-map?mapId=${mapId}`);
        const { map } = await r.json();

        if (!map) throw new Error('DB didnt returned a map')

        const { nodes, edges } = map;

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

            const { nodes, edges } = e;

            //if clicked on empty screen, hide editBox
            if (edges.length === 0 && nodes.length === 0) {

                editBox.style.display = 'none';
                deleteEdge.style.display = 'none'
            }

        })

        network.on('hold', e => {

            const { edges, nodes } = e;

            if (edges.length === 0 && nodes.length === 0) {
                const nodeId = `id${Math.random().toString(16).slice(2)}`;
                const mapId = getMapId();
                const node = { id: nodeId, label: 'test' }
                data.nodes.add([node]);

                createNode(mapId, node);
                socket.emit('node create', node)
            }
        })



        network.on('selectNode', e => {
            const { nodes, pointer } = e;

            editBox.style.display = 'block'

            editBox.style.top = `${pointer.DOM.y + 120}px`;
            editBox.style.left = `${pointer.DOM.x}px`;


            const nodeId = nodes[0];

            const nodeLabel = data.nodes.get(nodeId)



            editForm.children.nodeName.value = nodeLabel.label;
            editForm.dataset.nodeId = nodeId;
            linkFav.dataset.form = nodeId;
            const { connect, from } = setConnectNodes({});
            if (connect) {
                //connect to
                setConnectNodes({ toNew: nodeId });
                const edgeId = data.edges.add({ from, to: nodeId })[0];
                socket.emit('edge create', { mapId, from, to: nodeId, id: edgeId })

            } else {
                //set new from-node
                setConnectNodes({ fromNew: nodeId });
            }

            console.dir(editForm)


        })

        network.on('selectEdge', e => {

            const { edges, pointer } = e;

            const edgeId = edges[0];

            deleteEdge.style.display = 'block'
            deleteEdge.style.top = `${pointer.DOM.y - 100}px`;
            deleteEdge.style.left = `${pointer.DOM.x - 40}px`;

            deleteEdge.dataset.edgeId = edgeId;


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

        socket.on('edge create', edge => {
            try {

                const { from, to } = setConnectNodes({});
                if (from == edge.from && to === edge.to) {

                } else {
                    data.edges.add(edge);
                }

            } catch (e) {
                console.error(e)
            }
        })

        socket.on('edge delete', edgeId => {
            data.edges.remove(edgeId);
        })


    } catch (e) {
        console.error(e)
    }
}



function handleUpdate(e) {

    e.preventDefault();

    const nodeName = document.getElementById('nodeName').value;
    const nodeId = editForm.dataset.nodeId;

    data.nodes.updateOnly({ id: nodeId, label: nodeName });
    document.getElementById('nodeName').value = '';
    editBox.style.display = 'none';

    //update on other clients
    //get item
    let updatedNode = data.nodes.get(nodeId);
    const mapId = getMapId();

    socket.emit('node update', { mapId, updatedNode })

}

function closeEditBox(e) {
    e.stopPropagation();

    const icon = document.getElementById('linkFavIcon')
    let iconText = icon.innerText;
    icon.innerText = 'link';
    linkFav.style.background = 'var(--gray2)'
    console.dir(setConnectNodes({ isClear: true }));
    editBox.style.display = 'none'
}



function createNode(mapId, node) {

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
            console.info(data)
        })
        .catch(e => console.error(e))
}



function connectNodesEvent(e) {
    e.stopPropagation()
    const icon = document.getElementById('linkFavIcon')
    let iconText = icon.innerText;

    if (iconText == 'link') {
        icon.innerText = 'link_off';
        linkFav.style.background = 'var(--accent)'
        console.dir(setConnectNodes({ connectNew: true }))
    } else {
        icon.innerText = 'link';
        linkFav.style.background = 'var(--gray2)'
        console.dir(setConnectNodes({ connectNew: false }))
    }

}

function deleteEdgeFn(e) {
    e.stopPropagation()


    const edgeId = deleteEdge.dataset.edgeId;
    const mapId = getMapId();

    deleteEdge.style.display = 'none';

    socket.emit('edge delete', { mapId, edgeId })
}

