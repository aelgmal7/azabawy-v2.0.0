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

const getAllBills = async() => {
    return Bill.findAll({where: {enabled: true},
        include: [{model:Product,where: {enabled: true}}]
        })
}
const getClientBills =async(clientId) => {
     return await Bill.findAll({where: {enabled: true,clientId:clientId}})
     .then( async(bills)=> {
        const container =[]
        // get products for individual bill
        for (let index = 0; index < bills.length; index++) {

            const element = await bills[index].getProducts();
            // console.log(element);
            container.push(await element)
            
        }
        return await container
       
       
    }).then((container) => {
        // console.log(container.length);
        return container
        .map(bill => {

            // reformat products object 
            const billId= bill[0].billItem.BillId
            if(billId == 1){

                 console.log(bill);
            }
            const productsContainer = []
            const products = bill.map((product,index)=>{
                const item ={
                    id:product.id,
                    productName:product.productName,
                    weights:[
                        {
                            id:product.billItem.id,
                            weight:product.billItem.weight,
                            amount:product.billItem.amount,
                            billId: product.billItem.BillId,
                            productId: product.billItem.productId
                        }
                    ]

                }
                if(index == 0){
                    productsContainer.push(item)
                }else if(productsContainer.filter(element=> element.id === item.id ).length>0){
                    const innerIndex = productsContainer.findIndex(element => element.id == item.id)
                    // console.log(productsContainer[innerIndex]);
                    productsContainer[innerIndex].weights.push(item.weights[0])
                }else {
                    productsContainer.push(item)
                }


            })
            return {
                billId,
                products:productsContainer
            }
        })

    })
}


const addBill = async (clientId,billData,productsDetails,options) => {
    let oldClientTotalBalance=0
    try {
       const productsIds = productsDetails.map(product => product.id)
       const client = await Client.findByPk(clientId)
       oldClientTotalBalance = client.totalBalance
       //client changes
       const bill = await client.createBill({cost:billData.cost,clientId:clientId,type:billData.type,paid:billData.paid,date:billData.date})
       if (billData.type ==='فاتوره مرتجع بيع'){

           
           console.log("in rag3");
            client.totalBalance -= billData.cost
            client.remain -= billData.cost
            await client.save()

        }else{

            client.totalBalance += billData.cost
            client.paid += billData.paid
            client.remain += billData.cost - billData.paid
            await client.save()
            
            //bill changes
            bill.remainAfterOp = client.remain
            await bill.save()
        }
            
            // product work 
            const products = await Product.findAll({where :{ id:{[Op.or] :productsIds}}})
            // console.log(products.length);
            const orderArr = []
            const repeatedProducts=[]

            const productsContainer =[]
            productsIds.map(async(id) => {
                      products.forEach((product) => {
                       
                        if(id == product.dataValues.id) {
                           
                            productsContainer.push(product); 
                        }
                    })
                })
                // console.log("container",productsContainer);
                let billItem= null
                let arr =[]
                productsContainer.forEach((product) => {
                productsDetails.forEach((element,index) => {
                    if(element.id === product.id){
                        if(!repeatedProducts.includes(index)){
                            repeatedProducts.push(index)
                            const {weight,amount,kiloPrice,orderFlag} = element
                            // console.log(weight,amount, product.productName);
                             billItem = bill.addProduct(product,{through:{productName:product.productName,weight:weight,amount:amount,kiloPrice:kiloPrice}})
                             arr.push(billItem);   
                            //  console.log(arr);
                             //console.log("here",billProducts);
                            console.log("وربنا شغال");
                            // order handling
                            if (billData.type !=='فاتوره مرتجع بيع'){

                                if (billData.orderId !== null){
                                    console.log("in order section");
                                    if (orderFlag !== null && orderFlag === true && element.orderItemId !== null) {
                                        console.log(`adding order item with id ${element.orderItemId} to orderArr`);
                                        orderArr.push({id:element.orderItemId,delivered:Number(amount * weight)})
                                    }
                                }
                            }
                                //weights handling
                                if (billData.type ==='فاتوره مرتجع بيع'){
                                    
                                    WeightAndAmount.findOne({where: {productName:product.productName,enabled:true, weight:weight}}).then((item)=>{
                                        item.amount += Number(amount);
                                        product.totalAmount += Number(amount);
                                        product.totalWeight += (Number(weight) * Number(amount)); 
                                        item.save()
                                        product.save();
                                    })

                                }else {

                                    WeightAndAmount.findOne({where: {productName:product.productName,enabled:true, weight:weight}}).then((item)=>{
                                        item.amount -= Number(amount);
                                        product.totalAmount -= Number(amount);
                                        product.totalWeight -= (Number(weight) * Number(amount)); 
                                        item.save()
                                        product.save();
                                    })
                                }
                            }
                    }
            })
        })
             const finalArr = await Promise.all(arr);
            // let temp = billProducts[mohamed.length - 1];

            if (productsDetails.some(product => product.orderFlag)){
                // console.log( Number(clientId),billData.orderId,);
                // console.log("clientId,billData.orderId,");
                if(billData.orderId !== null){
                    
                     changeOrderItemsDeliveredWeight(clientId,JSON.stringify(billData.orderId),orderArr)
                }
            }
                console.log(options);
            printBill(bill,client,oldClientTotalBalance,options,billData.type)
            
            
             return {
                 bill,products:finalArr,
                    }
     
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

const printBill = async(bill1,client,oldClientTotalBalance=null,option,billType) => {
    // console.log('client :>> ', client.dataValues);
    const billProducts = []
    const bill = await Bill.findOne({where: {enabled: true,id: bill1.id}})
    // console.log(bill);
    console.log(option);
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
       
        const priced = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:1,billType})
        const tax = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:2,billType})
        const priceWithTax = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:3,billType})
        const empty = await  ejs.renderFile(`${path.join(__dirname,'..',"views","bill.ejs")}`,{bill:bill,products:billProducts,client,totalWeight,totalAmount,totalCost,oldClientTotalBalance,type:4,billType})
        
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