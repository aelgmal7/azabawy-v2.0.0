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
  const bills =await Bill.findAll({where: {enabled: true,ClientId: clientId}}).then( (bills) => {
    return bills.map( (bill) =>{
      const temp = bill.dataValues
      return {
        id: temp.id,
        paid: temp.paid,
        date: temp.date,
        remainAfterOp: temp.remainAfterOp,
        clientId: temp.clientId,
        billCost: temp.cost,
        type: "فاتورة بيع",
        text: `فاتورة بيع برقم ${temp.id}`

      }

      console.log(bill);
      return {

      }
    })
  })
  const payForBill = await BillPay.findAll({where: {enabled: true,ClientId: clientId}}).then(pays=> {
    return pays.map(pay =>{
      const temp = pay.dataValues
      return {
        id: temp.id,
        paid: temp.money,
        date: temp.date,
        note: temp.note,
        remainAfterOp: temp.remainAfterOp,
        billId: temp.billId,
        clientId: temp.clientId,
        text: ` دفع علي حساب فاتوره رقم ${ temp.BillId}`,
        type: "حساب فاتورة"
      }
     
    })
  })
  const directPay =await DirectPay.findAll({where: {enabled: true,ClientId: clientId}}).then(pays=> {
    return pays.map(pay =>{
      const temp = pay.dataValues
      return {
        id: temp.id,
        paid: temp.money,
        date: temp.date,
        note: temp.note,
        remainAfterOp: temp.remainAfterOp,
        clientId: temp.clientId,
        text: temp.note,
        type: "عملية دفع مباشرة"
      }
    })})
  let all =await  [...bills, ...directPay, ...payForBill]
   all = all.sort((a,b)=> {
    let da = new Date(a.date)
    let db = new Date(b.date)
   return  db - da
  })
  return all
}
const sendIndividualBill = async () => {}
module.exports = {
  createClient: createClient,
  getClients : getClients,
  deleteClient:deleteClient,
  updateClient:updateClient,
  clientAllOP:clientAllOP

};
