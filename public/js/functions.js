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
    }).catch(e => console.error(e))
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

function getMapId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mapId');
}