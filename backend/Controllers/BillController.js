const express = require("express");
const router = express.Router()
const {
    addBill,
    getAllBills,
    getClientBills,
    getBillById,
    payForBill,
} = require('../Services/BillService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

router.get('/print-bill',async(req,res) => {
    const temp = await  ejs.renderFile(`${path.join("backend","views","bill.ejs")}`,{title:"samaa7",header:"aaa"})
    


    let options = { format: 'A4' };
   
    let file = { content: temp };
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      console.log("PDF Buffer:-", pdfBuffer);
      fs.writeFile(`${path.join("backend","views","bill.pdf")}`,pdfBuffer,err => {
        res.download(`${path.join("backend","views","bill.pdf")}`)
        require('child_process').exec(`explorer.exe "${path.join("backend","views","bill.pdf")}"`);


      });
    })

})

router.post('/add-bill/:clientId', async (req, res) =>{
    const clientId = req.params.clientId
    const billData = req.body.billData
    const products = req.body.productsDetails
    const result = await addBill(clientId,billData,products)
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{result}))
    }catch (err) {}
})

router.get('/client',async (req, res)=> {
    const clientId = req.query.clientId
    const result = await getClientBills(clientId)
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{bills:result}))

    }catch (err) {}  
})
router.get('/:billId',async (req, res)=> {
    const billId = req.params.billId
    const result = await getBillById(billId)
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{bill:result}))

    }catch (err) {}  
})

router.post('/pay/:billId',async (req, res)=> {
    const billId = req.params.billId
    const clientId = req.query.clientId
    const {cash, date,note} = req.body
    const result = await payForBill(billId, clientId,date,cash,note)
    try {
        if(result.message){
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
            
        }else {
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{pay:result}))
            
        }
        
        
    }catch (err) {}
})
router.get('/',async (req, res)=> {
    const result = await getAllBills()
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{bills:result}))

    }catch (err) {}
})
module.exports = {billRouter:router}