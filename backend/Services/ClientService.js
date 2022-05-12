const { Client } = require("../Models/Client");
const { ClientModel } = require("../Classes/Client");

const createClient = ({
  clientName,
  phoneNumber,
  type,
  typeString,
  totalBalance,
  paid,
  remain,
  // orders,
  bills,
  paying,
}) => {
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
  );
  return Client.create(client);
};
const getClients = () => {
  return Client.findAll();
};

module.exports = {
  createClient: createClient,
  getClients : getClients,
};
