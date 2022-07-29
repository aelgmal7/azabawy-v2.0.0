const {Pay} = require('../Models/Pay')
const {Client} = require('../Models/Client')
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
require('dotenv').config();

const getAllPayOperations = async() => {
    return await Pay.findAll({where: {enabled: true}})

}


const addPayOperations = async(money , date , note= null) => {
   return await Pay.create({money, date, note}).then((pay) => {
     return pay
   }).then((pay) => {
    printPay(pay)
    return pay
   })
    
}


const printPay = async(bill) => {

  const pay = await  ejs.renderFile(`${path.join(__dirname,'..',"views","emptyPay.ejs")}`,{bill:bill})

  let options = { format: 'A4' };
  // `${bill.id} ${client.clientName} ${(new Date(bill.date)).toLocaleDateString('en-US')} .pdf`
  let file = { content: pay };
  html_to_pdf.generatePdf(file, options).then(async(pdfBuffer) => {
      const pdfPath =`${bill.id}-${(new Date(bill.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
      console.log("PDF Buffer:-", pdfBuffer);
      if(process.env.PROD == "true"){
          const fwaterDirProd = `${path.join(app.getPath('userData'),"مدفوعات")}`

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

         
              fs.writeFile(`${path.join(path.join(app.getPath('userData'),"مدفوعات"),pdfPath)}`,pdfBuffer,err => {
                  if(err) {
                      console.log(err)
                      // er = err
                      return err
                  }

                  require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"مدفوعات"),pdfPath)}"`);
              });
      }else {
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
          
          fs.writeFile(`${path.join("backend","views","مدفوعات",pdfPath)}`,pdfBuffer,err => {
              require('child_process').exec(`explorer.exe "${path.join("backend","views","مدفوعات",pdfPath)}"`);
              
          });

      }

  })
}
const returnPay =async (id) => {
    
  const pay= await Pay.findOne({where: {enabled: true,id:id}})
  if(!pay){
    return  {
      message: `no paying with id ${id}`,
      code: 404,
    }
  }
  const pdfPath =`${pay.id}-${(new Date(pay.date)).toLocaleDateString("nl",{year:"2-digit",month:"2-digit", day:"2-digit"})}.pdf`
  console.log(typeof process.env.PROD);
  if(process.env.PROD == "true"){
    console.log("here")
    require('child_process').exec(`explorer.exe "${path.join(path.join(app.getPath('userData'),"مدفوعات"),pdfPath)}"`);

  }else{
    console.log("there");
    require('child_process').exec(`explorer.exe "${path.join("backend","views","مدفوعات",pdfPath)}"`);
}
return pdfPath
}

module.exports = {
    getAllPayOperations,
    addPayOperations,
    returnPay
}