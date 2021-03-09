function handleLogin(mapId) {
   
    try {

        const loginName = document.getElementById('loginSimple').value;
        console.log('login',loginName, mapId)

        if (loginName) {
            fetch('/users/simpleLogin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loginName, mapId })
            })
                .then(r => r.json())
                .then(({mapId, ok}) => {
                    if(mapId){
                        window.location.replace(`/map?mapId=${mapId}`);
                    } else{
                        window.location.replace(`/maps`);
                    }
                })
                .catch(e => console.error(e))
        }
    } catch (e) {
        console.error(e)
    }
}