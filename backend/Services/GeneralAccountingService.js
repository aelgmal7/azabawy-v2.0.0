const {Bill} = require('../Models/Bill')
const {Client} = require('../Models/Client')
const {BillPay} = require('../Models/BillPay')
const {DirectPay} = require('../Models/DirectPay')
const {Pay} = require('../Models/Pay')
const {
    returnBillPAy,
    returnBill,
    returnDirectPAy
} = require('./ClientService')
const {returnPay} =require('./PayService')

const getAllOp =async() => {
    let bills = await Bill.findAll({where: {enabled: true}})
    const clients = await  Client.findAll({where:{enabled:true}})
    bills = bills.map( (bill) =>{
        const temp = bill.dataValues
        return {
          id: temp.id,
          clientName:clients.find(c => c.id === temp.ClientId).clientName,
          paid: temp.paid,
          date: temp.date,
          remainAfterOp: temp.remainAfterOp,
          clientId: temp.ClientId,
          billCost: temp.cost,
          type: temp.type,
          text: `فاتورة ${temp.type =='فاتورة مرتجع بيع' ? 'مرتجع بيع':'بيع' } برقم ${temp.id}`
  
        }
      })


    let billPays = await BillPay.findAll({where: {enabled: true}})
    billPays =billPays.map(pay =>{
        const temp = pay.dataValues
        return {
          id: temp.id,
          clientName:clients.find(c => c.id === temp.ClientId).clientName,
          paid: temp.money,
          date: temp.date,
          note: temp.note,
          remainAfterOp: temp.remainAfterOp,
          billId: temp.billId,
          clientId: temp.clientId,
          text: ` دفع علي حساب فاتورة رقم ${ temp.BillId}`,
          type: "حساب فاتورة"
        }
       
      })

    let directPays = await DirectPay.findAll({where: {enabled: true}})
    directPays = directPays.map(pay =>{
        const temp = pay.dataValues
        return {
          id: temp.id,
          clientName:clients.find(c => c.id === temp.ClientId).clientName,
          paid: temp.money,
          date: temp.date,
          note: temp.note,
          remainAfterOp: temp.remainAfterOp,
          clientId: temp.clientId,
          text: temp.note,
          type: "عملية دفع مباشرة"
        }
      })



    let pays = await Pay.findAll({where: {enabled: true}})
    pays =pays.map(pay =>{
        const temp = pay.dataValues
        return {
          id: temp.id,
          paid: temp.money,
          date: temp.date,
          note: temp.note,
          text: temp.note,
          type: "عملية دفع مباشرة"
        }
      })

    const total = [...bills,...billPays,...directPays,...pays].sort((a,b)=>  b.date - a.date )
     return total
}

const openIndividual = async (id,type) => {
    if(type== "فاتورة بيع" || type== 'فاتورة مرتجع بيع'){

        returnBill(id)
      }else if(type==  "حساب فاتورة"){
        returnBillPAy(id)
      }else if(type== "عملية دفع مباشرة عميل"){
        returnDirectPAy(id)
      }else if(type== "عملية دفع مباشرة"){
        console.log("www");
        returnPay(id)
    }
    return "done"

    
}
module.exports = {
    getAllOp,
    openIndividual
}