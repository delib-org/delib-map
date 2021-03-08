let maps = [{ mapId: 1, name: 'first map' }, { mapId: 2, name: 'second map' }]
const mapsRoot = document.getElementById('mapsRoot');

let html = ''
maps.forEach(map => {
    console.log(map)
    html += `<p>map name: ${map.name}</p>`
})
mapsRoot.innerHTML = html;

function handleCreateMap() {
    console.log('creating map')

    fetch('/maps/createMap', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(r=>r.json())
    .then(data=>console.log(data))
}