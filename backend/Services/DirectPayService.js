const {DirectPay} = require('../Models/DirectPay')
const {Client} = require('../Models/Client')
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const {app} = require('electron')
const {prodState} = require('../Common/index')

require('dotenv').config();


const getAllDirectPayOperations = async() => {
    return await DirectPay.findAll({where: {enabled: true}})

}


const addDirectPayOperations = async(clientId,money , date , note= null) => {
    console.log(money);
    return Client.findOne({where: {enabled: true,id: clientId}})
    .then((client) => {
        if (!client) {
            return {
                message: `no client with id ${clientId}`,
                code: 404,
            }
        }let oldRemain = client.remain
        client.paid += money
        client.remain -= money
        client.save()
        return client.createDirectPay({money:money,date:date,note:note,remainBeforeOp:oldRemain}).then(pay => {
            pay.remainAfterOp = client.remain
            pay.save()
            return pay 
        }).then(pay => {
            printDirectPay(client,pay)
            return pay
        })
    })
    
}


const printDirectPay = async(client,bill) => {

    const pay = await  ejs.renderFile(`${path.join(__dirname,'..',"views","directPay.ejs")}`,{pay:bill,client})

    let options = { format: 'A4' };
    // `${bill.id} ${client.clientName} ${(new Date(bill.date)).toLocaleDateString('en-GB')} .pdf`
    let file = { content: pay };
    html_to_pdf.generatePdf(file, options).then(async(pdfBuffer) => {
        const pdfPath =`${client.clientName}/${bill.id}-${client.clientName}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
        console.log("PDF Buffer:-", pdfBuffer);
        console.log(prodState());
        if(prodState()){
             const dataContainer =  `${path.join(app.getPath('userData'),"UserData")}`

            const fwaterDirProd = `${path.join(app.getPath('userData'),"UserData","مدفوعات")}`
            const clientDirProd = `${path.join(app.getPath('userData'),"UserData","مدفوعات",client.clientName)}`
            console.log("i am here in pro");

            try {
                // first check if directory already exists
                if (!fs.existsSync(dataContainer)) {
                    fs.mkdirSync(dataContainer);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
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
                fs.writeFile(`${path.join(path.join(app.getPath('userData'),"UserData","مدفوعات"),pdfPath)}`,pdfBuffer,err => {
                    if(err) {
                        console.log(err)
                        // er = err
                        return err
                    }

                    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"UserData","مدفوعات"),pdfPath)}"`);
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


module.exports = {
    getAllDirectPayOperations,
    addDirectPayOperations
}