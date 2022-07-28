const  {Bill} = require('../Models/Bill')
const Sequelize = require('Sequelize')
const Op = Sequelize.Op;
const {app} = require('electron')

const  {Client} = require('../Models/Client')
const  {Product} = require('../Models/Product')
const  {BillItem} = require('../Models/BillItem')
const  {BillPay} = require('../Models/BillPay')
const {WeightAndAmount} = require("../Models/WeightAndAmount")
const { changeOrderItemsDeliveredWeight } = require('./OrderService')
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

require('dotenv').config();
const azb =[]

const getAllBills = async() => {
    return Bill.findAll({where: {enabled: true},
        include: [{model:Product,where: {enabled: true}}]
        })
}
const getClientBills =async(clientId) => {
     return await Bill.findAll({where: {enabled: true,clientId:clientId}})
     .then( async(bills)=> {
        const container =[]
        for (let index = 0; index < bills.length; index++) {

            const element = await bills[index].getProducts();
            // console.log(element);
            container.push(await element)
            
        }
        return await container
       
       
    }).then((container) => {
        console.log(container.length);
        return container
        .map(bill => {
            const billId= bill[0].billItem.BillId
            return {
                billId,
                products:bill
            }
        })

    })
}
const addBill = async (clientId,billData,productsDetails,options) => {
    let oldClientTotalBalance=0
    try {
       const productsIds = productsDetails.map(product => product.id)
        return Client.findByPk(clientId).then((client)=> {
            oldClientTotalBalance = client.totalBalance
            //creating bill
            return client.createBill({cost:billData.cost,clientId:clientId,paid:billData.paid,date:billData.date}).then((bill)=> {
            return bill
        }).then((bill)=> {
            // client accounting for bill
            client.totalBalance += billData.cost
            client.paid += billData.paid
            client.remain += billData.cost - billData.paid
            client.save()

            bill.remainAfterOp = client.remain
            bill.save() 
            return bill

        })
        .then(async (bill)=> {
            // creating bill details 
            const orderArr = []
            const repeatedProducts=[]
            return await Product.findAll({where :{ id:{[Op.or] :productsIds}}}).then(async(products)=> {
                // console.log(products);
                const productsContainer =[]
                let tempProducts= products
                 await productsIds.map(async(id) => {
                      products.map((product) => {
                       
                        if(id == product.dataValues.id) {
                           
                            productsContainer.push(product); 
                        }
                    })
                    return productsContainer
                })
                return productsContainer
                
            }).then((products)=> {
                // console.log(products);
                return  bill.addProducts(products.map(product =>{
                    // console.log(products.length);
                    productsDetails.map((element,index) => {
                        // console.log(repeatedProducts);
                        if(element.id === product.id){
                            if(!repeatedProducts.includes(index)){
                            //    console.log(element);
                                // if( repeatedProducts.find(item => item.id == element.id && item.index == index)){
                                    repeatedProducts.push(index)
                                    
                                    const {weight,amount,kiloPrice,orderFlag} = element
                                    console.log(weight,amount, product.productName);
                                    product.billItem = {productName:product.productName,weight:weight,amount:amount,kiloPrice:kiloPrice}
                                    // product.save();
                                    // console.log(product.BillItem);

                            if (billData.orderId !== null){

                                if (orderFlag !== null && orderFlag === true && element.orderItemId !== null) {
                                    
                                    orderArr.push({id:element.orderItemId,delivered:Number(amount * weight)})
                                }
                            }
                            //change selected products amount of weights and change product total amount and weight
                             WeightAndAmount.findOne({where: {productName:product.productName,enabled:true, weight:weight}}).then((item)=>{
                                item.amount -= Number(amount);
                                product.totalAmount -= Number(amount);
                                product.totalWeight -= (Number(weight) * Number(amount)); 
                                item.save()
                                product.save();
                            })

                            }
                        // }
                        }
                    })
                    azb.push(product)
                    return product
                })).then((products) => {
                    // console.log('orderArr :>> ', orderArr);
                    //  console.log(azb);
                    if (productsDetails.some(product => product.orderFlag)){
                        // console.log( Number(clientId),billData.orderId,);
                        // console.log("clientId,billData.orderId,");
                        if(billData.billData !== null){
                            
                             changeOrderItemsDeliveredWeight(clientId,JSON.stringify(billData.orderId),orderArr)
                        }
                    }
                    
                    printBill(bill,client,oldClientTotalBalance,options)
                    
                    
                     return {
                         bill,products,
                    }
                })
            })
            //    return await  bill.addProduct(product,{through:{productName:product.productName,weight:50,amount:40,kiloPrice:12}})
        })
    })
}catch (err) {}

}
const getBillById = async(billId) =>{
    return Bill.findOne({where: {enabled: true,id: billId},include: ['products']})
}

const payForBill = async(billId,clientId,date, money,note=null) =>{
    return Client.findOne({where: {enabled: true,id: clientId}}).then(client =>{
        if (!client) {
            return {
                message: `no client with id ${clientId}`,
                code: 404,
            }
        }
      
        return client.getBills({where: {enabled: true,id:billId}}).then((bills) => {
            const bill = bills[0]
            if(!bill) {
                return { 
                    message: `no bill with id ${billId}`,
                    code: 404,
                }
            }
            bill.paid += money
            client.paid += money
            client.remain -= money
            client.save()
            bill.save()
            return bill.createBillPay({money:money,note:note,date:date,ClientId:Number(clientId)}).then(pay => {
                pay.remainAfterOp = client.remain
                pay.save()
                return pay
                  
            }).then(pay => {
                printPay(client,pay)
                return pay
            })
        })
    })
} 

const printPay = async(client,bill) => {

    const pay = await  ejs.renderFile(`${path.join(__dirname,'..',"views","pay.ejs")}`,{bill:bill,client})

    let options = { format: 'A4' };
    // `${bill.id} ${client.clientName} ${(new Date(bill.date)).toLocaleDateString('en-US')} .pdf`
    let file = { content: pay };
    html_to_pdf.generatePdf(file, options).then(async(pdfBuffer) => {
        const pdfPath =`${client.clientName}/${bill.id}-${client.clientName}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
        console.log("PDF Buffer:-", pdfBuffer);
        if(process.env.PROD == "true"){
            const fwaterDirProd = `${path.join(app.getPath('userData'),"مدفوعات")}`
            const clientDirProd = `${path.join(app.getPath('userData'),"مدفوعات",client.clientName)}`

            try {
                // first check if directory already exists
                if (!fs.existsSync(fwaterDirProd)) {
                    fs.mkdirSync(fwaterDirProd);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }

            try {
                // first check if directory already exists
                if (!fs.existsSync(clientDirProd)) {
                    fs.mkdirSync(clientDirProd);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
                fs.writeFile(`${path.join(path.join(app.getPath('userData'),"مدفوعات"),pdfPath)}`,pdfBuffer,err => {
                    if(err) {
                        console.log(err)
                        // er = err
                        return err
                    }

                    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"مدفوعات"),pdfPath)}"`);
                });
        }else {
            const dir = `${path.join("backend","views","مدفوعات",client.clientName)}`
            const fwater = `${path.join("backend","views","مدفوعات")}`
            try {
                // first check if directory already exists
                if (!fs.existsSync(fwater)) {
                    fs.mkdirSync(fwater);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
            try {
                // first check if directory already exists
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
            fs.writeFile(`${path.join("backend","views","مدفوعات",pdfPath)}`,pdfBuffer,err => {
                require('child_process').exec(`explorer.exe "${path.join("backend","views","مدفوعات",pdfPath)}"`);
                
            });

        }

    })
}



const coreFn = async (temp,name,client,bill,option) => {

    let options = { format: 'A4' };
    // `${bill.id} ${client.clientName} ${(new Date(bill.date)).toLocaleDateString('en-US')} .pdf`
    let file = { content: temp };
    html_to_pdf.generatePdf(file, options).then(async(pdfBuffer) => {
        const pdfPath =`${client.clientName}/${bill.id}-${client.clientName}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}-${name}.pdf`
        console.log("PDF Buffer:-", pdfBuffer);
        if(process.env.PROD == "true"){
            const fwaterDirProd = `${path.join(app.getPath('userData'),"فواتير")}`
            const clientDirProd = `${path.join(app.getPath('userData'),"فواتير",client.clientName)}`

            try {
                // first check if directory already exists
                if (!fs.existsSync(fwaterDirProd)) {
                    fs.mkdirSync(fwaterDirProd);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }

            try {
                // first check if directory already exists
                if (!fs.existsSync(clientDirProd)) {
                    fs.mkdirSync(clientDirProd);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
                fs.writeFile(`${path.join(path.join(app.getPath('userData'),"فواتير"),pdfPath)}`,pdfBuffer,err => {
                    if(err) {
                        console.log(err)
                        // er = err
                        return err
                    }
                    if(option.printable === true) {

                        if ((option.type== 1 && name == "مسعره")||(option.type== 2 && name == "رقم-ضريبي")||(option.type== 3 && name == "مسعره-برقم-ضريبي")||(option.type== 4 && name == "خاليه")){
                            
                            require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"فواتير"),pdfPath)}"`);
                        }
                    }
                });
        }else {
            const dir = `${path.join("backend","views","فواتير",client.clientName)}`
            const fwater = `${path.join("backend","views","فواتير")}`
            try {
                // first check if directory already exists
                if (!fs.existsSync(fwater)) {
                    fs.mkdirSync(fwater);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
            try {
                // first check if directory already exists
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
            fs.writeFile(`${path.join("backend","views","فواتير",pdfPath)}`,pdfBuffer,err => {
                if(option.printable === true) {

                    if ((option.type== 1 && name == "مسعره")||(option.type== 2 && name == "رقم-ضريبي")||(option.type== 3 && name == "مسعره-برقم-ضريبي")||(option.type== 4 && name == "خاليه")){
                        console.log("here");
                        
                        require('child_process').exec(`explorer.exe "${path.join("backend","views","فواتير",pdfPath)}"`);
                    }
                }
            });

        }

    })
}

const printBill = async(bill,client,oldClientTotalBalance=null,option) => {
    // console.log('client :>> ', client.dataValues);
    const billProducts = []
     await bill.getProducts().then(products => {
        products.forEach(product =>{
            const {productName,weight,amount,kiloPrice} = product.billItem.dataValues
            billProducts.push({productName,weight,amount,kiloPrice})
            // console.log('bill :>> ',product.billItem.dataValues );
        })
    }).then(async()=> {
    

        let totalAmount =0 
        let totalWeight =0 
        let totalCost =0 
         billProducts.map(product =>{
            
            totalAmount += Number(product.amount)
            totalWeight += (Number(product.weight) * Number(product.amount))
            totalCost += (Number(product.weight) * Number(product.amount) * Number(product.kiloPrice))
        }) 
       
        const priced = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:1})
        const tax = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:2})
        const priceWithTax = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:3})
        const empty = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:4})
        
        coreFn(priced,"مسعره",client,bill,option)
        coreFn(tax,"رقم-ضريبي",client,bill,option)
        coreFn(priceWithTax,"مسعره-برقم-ضريبي",client,bill,option)
        coreFn(empty,"خاليه",client,bill,option)
       
    })
  
        
    }
    module.exports = {
    addBill: addBill,
    getAllBills:getAllBills,
    getClientBills:getClientBills,
    getBillById:getBillById,
    payForBill:payForBill
}