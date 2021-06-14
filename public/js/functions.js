function handleUpdate(e) {

    e.preventDefault();

    const nodeName = document.getElementById('nodeName').value;
    const { from } = networkState({});
    const nodeId = from

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
    console.dir(networkState({ isClear: true, connectNew: false }));
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



function connectTheNode(e) {
    e.stopPropagation()
    const icon = document.getElementById('linkFavIcon')
    let iconText = icon.innerText;

    if (iconText == 'link') {
        icon.innerText = 'link_off';
        linkFav.style.background = 'var(--accent)'
        console.dir(networkState({ connectNew: true }))
    } else {
        icon.innerText = 'link';
        linkFav.style.background = 'var(--gray2)'
        console.dir(networkState({ connectNew: false }))
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

function deleteNodeFn() {
    try {
        console.dir(networkState({}));
        const { from, connect } = networkState({});
    } catch (e) {
        console.error(e)
    }
}