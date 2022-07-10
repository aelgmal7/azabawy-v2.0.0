const { Client } = require("../Models/Client");
const { ClientModel } = require("../Classes/Client");

const createClient = async({
  clientName,
  totalBalance,
  paid
}) => {
    const client = new ClientModel(
      clientName,
      totalBalance,
      paid
    ); 
    const temp = await Client.findOne({where: {clientName: client.clientName}})
    if (temp === null) {
      
      return Client.create(client);
    } 
      if (temp.enabled) return {
        message: "client already exists",
        code:404
      }
};

const getClients = () => {
  return Client.findAll();
};

const deleteClient =async (clientId) => {

  return Client.findOne({where: {id: clientId,enabled: true}}).then((client) => {
    if(!client) {
      return {
        message: `no client with id ${clientId}`,
        code: 404
      }
    }
    client.enabled = false;
    client.save()
    return client
  })
}

const updateClient = async(clientId,clientName,totalBalance,paid) => {
  return Client.findOne({where: {id:clientId, enabled: true}})
  .then((client) => {
    if (!client) {
      return {
        message: `no client with id ${clientId}`,
        code: 404,
      }
    }
    if (typeof totalBalance !== 'number'|| typeof paid !== 'number') {
      return {
        message: `invalid total balance or paid`,
        code:500
      }
    }
    client.clientName = clientName;
    client.totalBalance = totalBalance;
    client.paid = paid;
    client.remain = Number(totalBalance) - Number(paid)
    client.save()
    return client;
  })
}

module.exports = {
  createClient: createClient,
  getClients : getClients,
  deleteClient:deleteClient,
  updateClient:updateClient

};
