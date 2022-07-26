const { Client } = require("../Models/Client");
const { ClientModel } = require("../Classes/Client");

const {DirectPay } = require("../Models/DirectPay")
const {Bill} = require("../Models/Bill")
const {BillPay} = require("../Models/BillPay")

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
    console.log(temp);
    if (temp === null) {
      
      return Client.create(client);
    }
    if (temp.enabled){
      return {
        message: " client already exists",
        code:404
      }
    } else if (!temp.enabled){
      temp.destroy()
      return Client.create(client)
    }
};

const getClients = () => {
  return Client.findAll({where: {enabled: true}});
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

const clientAllOP = async (clientId) => {
  const client = await Client.findOne({where: {enabled: true,id: clientId}})
  if (!client){
    return {
      message: `no client with id ${clientId}`,
      code: 404,
    }
  }
  const bills =await Bill.findAll({where: {enabled: true,ClientId: clientId}})
  const payForBill = await BillPay.findAll({where: {enabled: true,ClientId: clientId}}).then(pays=> {
    return pays.map(pay =>{
      pay.dataValues.type =` دفع علي حساب فاتوره رقم ${ pay.BillId}`
      return pay
    })
  })
  const directPay =await DirectPay.findAll({where: {enabled: true,ClientId: clientId}}).then(pays=> {
    return pays.map(pay =>{
      const c = Client.findOne({where: {enabled: true,id: clientId}})
      pay.dataValues.type =` دفع علي حساب العميل `
      return pay
    })})
  let all =await  [...bills, ...directPay, ...payForBill]
   all = all.sort((a,b)=> {
   return a.date > b.date
  })
  return all
}

module.exports = {
  createClient: createClient,
  getClients : getClients,
  deleteClient:deleteClient,
  updateClient:updateClient,
  clientAllOP:clientAllOP

};
