const  {Client} = require('../Models/Client')
const  {ClientModel} = require('../Classes/Client')

const clientCreate = ({clientName,phoneNumber,type,typeString, totalBalance, paid, remain,orders, bills,paying}) => {

    
    
    const client = new ClientModel(
        clientName,
     phoneNumber, 
     type,
      typeString,
      totalBalance,
      paid,
      remain,
      bills,
      paying
     



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