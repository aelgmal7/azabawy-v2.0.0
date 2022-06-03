const {createOrder,getOrderById} = require('../Services/OrderService')
const express = require("express");
const router = express.Router()
const {returnedResult} = require('../Payload/ReturnedResult')
const {HTTP_STATUS_CODES} =require('../Payload/statusCode.ts')

router.post('/add-order',async (req, res, next) =>{
     
    let result =await createOrder(clientId= req.query.clientId,payload=req.body)
    try {
        console.log("sadfgh", result)
        if(result == undefined) {
                
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{message:`no client with id ${req.query.clientId} `}))
        } else {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{orders:result}))
        }

    }catch(error){
    }
 
 })
 
 router.get('/:id',async (req, res, next) =>{
     let orderId = req.params.id;
     let clientId = req.query.clientId;
    let result =await getOrderById({clientId:clientId,orderId:orderId})
    // console.log(result)
    try {
        if(result == undefined) {
            
            res.status(400).send({message:"no order with id " + orderId});
        } else {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{items:result}))
        }
        console.log(result)
        
    }catch(error){
        console.log(error)
    }
 
 })

 router.post('/',async (req, res, next) =>{
     console.log(req.body)
     res.send("received")
 })



 module.exports ={orderRouter:router}