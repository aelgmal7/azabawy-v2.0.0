const  {Client} = require('../Models/Client')
const  {ClientModel} = require('../Classes/Client')

const clientCreate = (payload) => {

    
    
    const client = new ClientModel(
        payload.clientName,
     payload.phoneNumber, 
     payload.type,
      payload.typeString,
      payload.totalBalance,
      payload.paid,
      payload.remain,
      payload.bills,
      payload.paying
     



)
return Client.create(client)
    }
    const getClient = () => {
         return Client.findAll()
    }

 module.exports = {
    clientCreate: clientCreate,
     getClient: getClient
    }   