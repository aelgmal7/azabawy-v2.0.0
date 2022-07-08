const  {Bill} = require('../Models/Bill')
const Sequelize = require('Sequelize')
const Op = Sequelize.Op;

const  {Client} = require('../Models/Client')
const  {Product} = require('../Models/Product')
const  {BillItem} = require('../Models/BillItem')
const {WeightAndAmount} = require("../Models/WeightAndAmount")

const getAllBills = async() => {
    return Bill.findAll({where: {enabled: true}})
}
const getClientBills =async(clientId) => {
    return Bill.findAll({where: {enabled: true,clientId:clientId},
        include: [{model:Product,where: {enabled: true}}]
    })
}
const addBill = async (clientId,billData,productsDetails) => {
    try {
       const productsIds = productsDetails.map(product => product.id)
        return Client.findByPk(clientId).then((client)=> {

            //creating bill
            return client.createBill({cost:billData.cost,clientId:clientId,paid:billData.paid,date:billData.date}).then((bill)=> {
            return bill
        }).then((bill)=> {
            // client accounting for bill
            client.totalBalance += billData.cost
            client.paid += billData.paid
            client.remain += billData.cost - billData.paid
            client.save()
            return bill

        })
        .then(async (bill)=> {
            // creating bill details 
            return await Product.findAll({where :{ id:{[Op.or] :productsIds}}}).then(async(products)=> {
                return await bill.addProducts(products.map(product =>{

                    productsDetails.map(async(element) => {
                        if(element.id === product.id){
                            const {weight,amount,kiloPrice} = element
                            product.billItem = {productName:product.productName,weight:weight,amount:amount,kiloPrice:kiloPrice}
                            
                            //change selected products amount of weights and change product total amount and weight
                            await WeightAndAmount.findOne({where: {productName:product.productName,enabled:true, weight:weight}}).then((item)=>{
                                item.amount -= Number(amount);
                                product.totalAmount -= Number(amount);
                                product.totalWeight -= (Number(weight) * Number(amount)); 
                                item.save()
                                product.save();
                            })
                        }
                    })
                    return product
                })).then(products => {
                    return {bill,products}
                })
            })
            //    return await  bill.addProduct(product,{through:{productName:product.productName,weight:50,amount:40,kiloPrice:12}})
        })
    })
}catch (err) {}

}
const getBillById = async(billId) =>{
    return Bill.findOne({where: {enabled: true,id: billId}})
}

module.exports = {
    addBill: addBill,
    getAllBills:getAllBills,
    getClientBills:getClientBills,
    getBillById:getBillById
}