console.log('main');

const socket = io();


const editBox = document.getElementById('editBox');

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

    editBox.style.display = 'block'

    editBox.style.top = `${pointer.DOM.y}px`;
    editBox.style.left = `${pointer.DOM.x}px`;

    const editForm = document.getElementById('editForm');
    editForm.dataset.nodeId = nodes[0];
    data.nodes.updateOnly({ id: nodes[0], label: "Updating.........." })

})

data.nodes.updateOnly({ id: 2, label: "BOOOOOMMMMM12" })
data.nodes.add([{ id: 6, label: 'Aded' }]);
data.edges.add({ from: 6, to: 1 })

function handleUpdate(e) {
    console.log(e)
    e.preventDefault();

    const nodeName = e.target.children.nodename.value;
    const nodeId = parseInt(e.target.dataset.nodeId);

    console.log(nodeId, nodeName);
    console.log(typeof nodeName)

    data.nodes.updateOnly({ id: nodeId, label: nodeName });
    e.target.reset();
    editBox.style.display = 'none';

    //update on other clients
    //get item
    let updatedNode = data.nodes.get(nodeId);

    socket.emit('node update',updatedNode)

}

socket.on('node update',updatedNode=>{
    data.nodes.updateOnly({ id: updatedNode.id, label: updatedNode.label });
})