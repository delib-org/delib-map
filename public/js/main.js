const socket = io();

const editBox = document.getElementById('editBox');
const editForm = document.getElementById('editForm');
const linkFav = document.getElementById('linkFav');
const linkFavIcon = document.getElementById('linkFavIcon');
const deleteEdge = document.getElementById('deleteEdge');
const deleteNode = document.getElementById('deleteNode');
editBox.style.display = 'none'

linkFav.addEventListener('click', connectTheNode)
deleteEdge.addEventListener('click', deleteEdgeFn);
deleteNode.addEventListener('click',deleteNodeFn)

let data;

//clouser for nodes and edges
function networkStateClouser({ from, to, clear, edgeId, connect }) {
    return function ({ fromNew, toNew, isClear, edgeIdNew, connectNew }) {

        if (fromNew) from = fromNew;
        if (toNew) to = toNew;
        if (edgeIdNew) edgeId = edgeIdNew;
        if (connectNew !== undefined) connect = connectNew;

        if (isClear) {
            to = null;
            from = null;
        }

        return { from, to, edgeId, connect }
    }

}


const networkState = networkStateClouser({ from: null, to: null });

//this is the way to change thenodes clouster
//
// networkState({fromNew:null}); --empty from
// networkState({fromNew:'f'}); -- set new from
// networkState({toNew:'h'}) -- set new to
// networkState({}) -- get current nodes
// networkState({isClear:true}) -- clear all

//events


(async () => {
    try {

        //get data from DB
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
                color: {
                    border:'blue',
                    background:'white'
                },
                shape:'box',
                fixed: false,
                font: '12px arial blue',
                scaling: {
                    label: true
                },
                margin:4,
                shadow: true,
                widthConstraint: 150,
            }
        }
        const network = new vis.Network(container, data, options);

        //network events
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
            console.log('selectNode')
            const { nodes, pointer } = e;
            const nodeId = nodes[0]

            //open the edit-box
            editBox.style.display = 'block'
            editBox.style.top = `${pointer.DOM.y + 120}px`;
            editBox.style.left = `${pointer.DOM.x}px`;


            //get and set the node label to the form
            const nodeLabel = data.nodes.get(nodeId)
            editForm.children.nodeName.value = nodeLabel.label;

            // editForm.dataset.nodeId = nodeId;
            // linkFav.dataset.form = nodeId;

            //if connect was pressed, connect the new node
            const { connect, from } = networkState({});
            if (connect) {

                //connect to
                networkState({ toNew: nodeId });
                const edgeId = data.edges.add({ from, to: nodeId })[0];

                //send to server
                socket.emit('edge create', { mapId, from, to: nodeId, id: edgeId })

            } else {
                //set it as a new "from"
                networkState({ fromNew: nodeId });
            }

        })

        network.on('selectEdge', e => {

            const { edges, nodes, pointer } = e;

            if (edges.length === 1 && nodes.length === 0) { // handle select one node

                console.log('only on edge was selected')
                //hide edit box
                editBox.style.display = 'none'

                //show delete button
                const edgeId = edges[0];

                deleteEdge.style.display = 'block'
                deleteEdge.style.top = `${pointer.DOM.y - 10}px`;
                deleteEdge.style.left = `${pointer.DOM.x - 40}px`;

                deleteEdge.dataset.edgeId = edgeId;
                networkState({ connectNew: false });
            } else {
                deleteEdge.style.display = 'none'
            }


        })


        //socket events

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

                const { from, to } = networkState({});
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
})()




