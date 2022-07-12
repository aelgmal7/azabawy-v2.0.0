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


router.get('/print-bill',async(req,res) => {
   
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