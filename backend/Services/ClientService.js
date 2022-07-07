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

module.exports = {
  createClient: createClient,
  getClients : getClients,
};
