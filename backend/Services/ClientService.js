const { Client } = require("../Models/Client");
const { BillItem } = require("../Models/BillItem");
const { ClientModel } = require("../Classes/Client");
const { Product } = require("../Models/Product");

const {DirectPay } = require("../Models/DirectPay")
const {Bill} = require("../Models/Bill")
const {BillPay} = require("../Models/BillPay")
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const {prodState} = require('../Common/index')


require('dotenv').config();
const {app} = require('electron')

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
    // console.log(temp);
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
  const billItems = await BillItem.findAll({where: {enabled: true}})
  const bills =await Bill.findAll({where: {enabled: true,ClientId: clientId}}).then( (bills) => {
    return bills.map(  (bill) =>{
      // console.log(products[0]);
      // const products =  Promise.resolve(bill.getProducts().then(products => products))
      const temp = bill.dataValues
      const products = billItems.filter( (product) =>product.BillId === temp.id)
      //  console.log(bill);
   
      return {
        id: temp.id,
        paid: temp.paid,
        date: temp.date,
        remainAfterOp: temp.remainAfterOp,
        clientId: temp.ClientId,
        billCost: temp.cost,
        type: temp.type,
        products:products.map(p => p.dataValues),
        text: `فاتورة ${temp.type =='فاتورة مرتجع بيع' ? 'مرتجع بيع':'بيع' } برقم ${temp.id}`

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
        billId: temp.BillId,
        clientId: temp.ClientId,
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
        clientId: temp.ClientId,
        text: temp.note,
        type: "عملية دفع مباشرة عميل"
      }
    })
  })
  let all =await  [...bills, ...directPay, ...payForBill]
   all = all.sort((a,b)=> {
    let da = new Date(a.date)
    let db = new Date(b.date)
   return  db - da
  })
  console.log(all);
  return all
}
const sendIndividualBill = async (type,id) => {
  if(type== "فاتورة بيع" || type== 'فاتورة مرتجع بيع'){

    return returnBill(id)
  }else if(type==  "حساب فاتورة"){
    returnBillPAy(id)
  }else if(type== "عملية دفع مباشرة عميل"){
    returnDirectPAy(id)
  }
  return "done"
}
// 28-فتح الله-08-07-22-مسعره-برقم-ضريبي
// `${client.clientName}/${bill.id}-${client.clientName}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}-${name}.pdf`
const returnBill = async (id) => {
  const bill = await Bill.findOne({where: {enabled: true,id:id}})
  if (!bill){
    return {
      message: `no bill with id ${id}`,
      code: 404,
    }
  }
  const name ="مسعره-برقم-ضريبي"
  const client = await Client.findOne({where: {enabled: true,id:bill.ClientId}})
  const billPath = `${client.clientName}/${bill.id}-${client.clientName}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}-${name}.pdf`
  // console.log(typeof process.env.PROD);
    if(prodState()){
    // console.log("here")
    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"فواتير"),billPath)}"`);

  }else{
    // console.log("there");
    require('child_process').exec(`explorer.exe "${path.join("backend","views","فواتير",billPath)}"`);
  }

  return billPath 
}
const returnDirectPAy = async (id) => {
  const directPay= await DirectPay.findOne({where: {enabled: true,id:id}})
  if(!directPay){
    return  {
      message: `no paying with id ${id}`,
      code: 404,
    }
  }
  const client = await Client.findOne({where: {enabled: true,id:directPay.ClientId}})
  const billPath = `${client.clientName}/${directPay.id}-${client.clientName}-${(new Date(directPay.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
  // console.log(typeof process.env.PROD);
  if(prodState()){
    // console.log("here")
    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"مدفوعات"),billPath)}"`);

  }else{
    // console.log("there");
    require('child_process').exec(`explorer.exe "${path.join("backend","views","مدفوعات",billPath)}"`);
  }
}
const returnBillPAy = async (id) => {

  const billPay= await BillPay.findOne({where: {enabled: true,id:id}})
  if(!billPay){
    return  {
      message: `no paying with id ${id}`,
      code: 404,
    }
  }
  const client = await Client.findOne({where: {enabled: true,id:billPay.ClientId}})
  const billPath = `${client.clientName}/${billPay.id}-${client.clientName}-${(new Date(billPay.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
  // console.log(typeof process.env.PROD);
   if(prodState()){
    // console.log("here")
    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"مدفوعات"),billPath)}"`);

  }else{
    // console.log("there");
    require('child_process').exec(`explorer.exe "${path.join("backend","views","مدفوعات",billPath)}"`);
  }

}



const printClientAllOpDetails =async (clientId) => {
  const ops = await clientAllOP(clientId)
  const client = await Client.findOne({where: {enabled: true,id:clientId}})
  const printing = await printCore(client,ops,true)
  return printing
  
}
const printClientAllOpShort =async (clientId) => {
  const ops = await clientAllOP(clientId)
  const client = await Client.findOne({where: {enabled: true,id:clientId}})
  const printing = await printCore(client,ops,false)
  return printing
  
}
const printCore = async (client,ops,details)=> {
  let printable;
  if (details == true){
    // console.log(client);

     printable = await  ejs.renderFile(`${path.join(__dirname,'..',"views","AllBillsInDetails.ejs")}`,{client,ops})
  }else{
     printable = await  ejs.renderFile(`${path.join(__dirname,'..',"views","AllBillsInShort.ejs")}`,{client,ops})

  }
  // TODO remove return 
  //  return printable
  // console.log(ops);
  let options = { format: 'A4' };
  // `${bill.id} ${client.clientName} ${(new Date(bill.date)).toLocaleDateString('en-US')} .pdf`
  let file = { content: printable };
  const name = "حساب"
  html_to_pdf.generatePdf(file, options).then(async(pdfBuffer) => {
      const pdfPath =`${client.clientName}/-${client.clientName}-${(new Date()).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}-${name}.pdf`
      // console.log("PDF Buffer:-", pdfBuffer);
       if(prodState()){
        const dataContainer =  `${path.join(app.getPath('userData'),"UserData")}`
          const fwaterDirProd = `${path.join(app.getPath('userData'),"حسابات")}`
          const clientDirProd = `${path.join(app.getPath('userData'),"حسابات",client.clientName)}`

          try {
              // first check if directory already exists
              if (!fs.existsSync(dataContainer)) {
                  fs.mkdirSync(dataContainer);
                  // console.log("Directory is created.");
              } else {
                  // console.log("Directory already exists.");
              }
          } catch (err) {
              // console.log(err);
          }
          try {
              // first check if directory already exists
              if (!fs.existsSync(fwaterDirProd)) {
                  fs.mkdirSync(fwaterDirProd);
                  // console.log("Directory is created.");
              } else {
                  // console.log("Directory already exists.");
              }
          } catch (err) {
              // console.log(err);
          }

          try {
              // first check if directory already exists
              if (!fs.existsSync(clientDirProd)) {
                  fs.mkdirSync(clientDirProd);
                  // console.log("Directory is created.");
              } else {
                  // console.log("Directory already exists.");
              }
          } catch (err) {
              // console.log(err);
          }
              fs.writeFile(`${path.join(path.join(app.getPath('userData'),"حسابات"),pdfPath)}`,pdfBuffer,err => {
                  if(err) {
                      // console.log(err)
                      // er = err
                      return err
                  }
                
                          
                          require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"حسابات"),pdfPath)}"`);
                      
              });
      }else {
          const dir = `${path.join("backend","views","حسابات",client.clientName)}`
          const fwater = `${path.join("backend","views","حسابات")}`
          try {
              // first check if directory already exists
              if (!fs.existsSync(fwater)) {
                  fs.mkdirSync(fwater);
                  // console.log("Directory is created.");
              } else {
                  // console.log("Directory already exists.");
              }
          } catch (err) {
              // console.log(err);
          }
          try {
              // first check if directory already exists
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir);
                  // console.log("Directory is created.");
              } else {
                  // console.log("Directory already exists.");
              }
          } catch (err) {
              // console.log(err);
          }
          fs.writeFile(`${path.join("backend","views","حسابات",pdfPath)}`,pdfBuffer,err => {

                      // console.log("here");
                      
                      require('child_process').exec(`explorer.exe "${path.join("backend","views","حسابات",pdfPath)}"`);
                
            
          });

      }

  })
  return printable
}
module.exports = {
  createClient: createClient,
  getClients : getClients,
  deleteClient:deleteClient,
  updateClient:updateClient,
  clientAllOP:clientAllOP,
  sendIndividualBill:sendIndividualBill,
  returnBillPAy:returnBillPAy,
  returnBill:returnBill,
  returnDirectPAy:returnDirectPAy,
  printClientAllOpDetails:printClientAllOpDetails,
  printClientAllOpShort:printClientAllOpShort


};
