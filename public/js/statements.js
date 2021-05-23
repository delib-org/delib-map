console.log(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/get_statements`)

axios.post(`http://ouri-digital-agent.cf/ibc/app/אורי/${contractId}/get_statements`, {
    "name": "get_statements",
    "values": { "parent": [] }
}).then(({ data }) => {
    console.log(data)
})