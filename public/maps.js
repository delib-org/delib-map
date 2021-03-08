const mapsRoot = document.getElementById('mapsRoot');

function renderMaps(maps) {

   

    let html = ''
    maps.forEach(map => {
        console.log(map)
        html += `<p><a href="/map?mapId=${map._id}">Map: ${map.name}</a></p>`
    })
    mapsRoot.innerHTML = html;
}

function renderNewMap(map){
    
    let beforeHtml = mapsRoot.innerHTML;
    html = `<p><a href="/map?mapId=${map._id}">map name: ${map.name}</a></p>`+ beforeHtml;
    mapsRoot.innerHTML = html;
}


function handleCreateMap() {
    try {
        console.log('creating map')
        const newMapName = document.getElementById('newMapName').value;

        if (newMapName) {

            fetch('/maps/createMap', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newMapName })
            })
                .then(r => r.json())
                .then(data => {
                    console.log(data);
                    const { mapId } = data;
                    if (mapId) {
                        window.location.replace(`/map?mapId=${mapId}`);
                    }
                })
        }
    } catch (e) {
        console.error(e)
    }
}

function getMaps() {
    fetch('/maps/get-all-maps')
        .then(r => r.json())
        .then(({ maps }) => {
            if (maps) {
                renderMaps(maps)
            }
        })
}



getMaps()