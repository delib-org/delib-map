class Agents {
    agents = [];
    _selectedAgent = '';

    selectedAgent(agent = false){
        if(!agent) return this._getSelectedAgent();
        else return this._SetselectedAgent(agent);
    }
    set setSelectedAgent(agent) {
        try {
            this._selectedAgent = agent;
        } catch (e) {
            console.error(e)
        }
    }
    get getSelectedAgent(){
        return this._selectedAgent;
    }

    getAgents = async function () {
        try {
            const { data } = await axios.get('http://ouri-digital-agent.cf/ibc/app')
            if (!Array.isArray(data)) {
                console.error(data);
                throw new Error('server respond with non array agents');
            }
            this.agents = data;
            this.renderAgents();
        } catch (e) {
            console.error(e);
        }
    }

    renderAgents() {
        try {
            const agentsRoot = document.getElementById('agents');
            let html = '<option selected disabled>Choose an agent</option>';
            this.agents.forEach(agent => {
                html += `<option value='${agent}' onchange='getContracts("${agent}")'>${agent}</option>`
            })
            agentsRoot.innerHTML = html;

        } catch (e) {
            console.error(e)
        }

    }
}

const agents = new Agents();

agents.getAgents();


async function getContracts(ev) {
    try {
        //is ev type of event

        const agent = ev.target.value;
        if(!agent) throw new Error('no agent')
        agents.setSelectedAgent = agent;

        const { data } = await axios.get(`http://ouri-digital-agent.cf/ibc/app/${agent}`)
        console.log(data);
        renderContracts(data);
    } catch (e) {
        console.error(e);

    }
}

function renderContracts(contracts) {
    const contractsRoot = document.querySelector('#contractsRoot');
    const selectedAgent = agents.getSelectedAgent;
    let html = '';
    contracts.forEach(contract => {
        html += `<div class='card contracts__contract' ><a href='/statements?agent=${selectedAgent}&contractId=${contract.name}'>Contract: ${contract.name}</a></div>`
    })

    contractsRoot.innerHTML = html;
}