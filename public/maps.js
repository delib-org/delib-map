let maps = [{ mapId: 1, name: 'first map' }, { mapId: 2, name: 'second map' }]
const mapsRoot = document.getElementById('mapsRoot');

let html = ''
maps.forEach(map => {
    console.log(map)
    html += `<p>map name: ${map.name}</p>`
})
mapsRoot.innerHTML = html;

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
                    const {mapId} = data;
                    if(mapId){
                        window.location.replace(`/map?mapId=${mapId}`);
                    }
                })
        }
    } catch (e) {
        console.error(e)
    }
}