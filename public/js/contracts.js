console.log("contracts....")

function handleGetContracts(){
    fetch('http://ouri-digital-agent.cf/ibc/app/אורי')
    .then(r=>r.json())
    .then(data=>{
        console.log(data)
        renderContracts(data)
    })
}

function  renderContracts(contracts){
    const contractsRoot = document.querySelector('#contractsRoot');

    let html = '';
    contracts.forEach(contract=>{
        html+= `<div class='card contracts__contract' ><a href='/statements?contractId=${contract.name}'>${contract.name}</a></div>`
    })

    contractsRoot.innerHTML = html;
}