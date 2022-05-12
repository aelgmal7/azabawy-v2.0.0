const {createOrder} = require('../Services/OrderService')
const express = require("express");
const router = express.Router()
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.get('/',async (req, res, next) =>{
     
    let result =await createOrder()
    try {

        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{orders:result}))
    }catch(error){
        console.log(error)
    }
 
 })



 module.exports ={orderRouter:router}