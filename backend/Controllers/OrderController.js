const {createOrder,getOrderById,getOrderItemsAsProduct,getAllOrders,changeOrderItemsDeliveredWeight} = require('../Services/OrderService')
const express = require("express");
const router = express.Router()
const {returnedResult} = require('../Payload/ReturnedResult')
const {HTTP_STATUS_CODES} =require('../Payload/statusCode.ts')




router.get("/",async  (req, res) => {
    let result = await getAllOrders()
    res.send(result)
    //TODO not completed 
})


router.post("/change-delivered/:orderId", async (req, res) => {
    let orderId = req.params.orderId;
    let clientId = req.query.clientId;
    let result = await changeOrderItemsDeliveredWeight(clientId, orderId)
    res.send(result)
})
router.post('/add-order',async (req, res, next) =>{
     
    let result =await createOrder(clientId= req.query.clientId,payload=req.body.orderDetails,productsDetails=req.body.productsDetails)
    try {
        // console.log("sadfgh", result)
        if(result.errorCode !== undefined) {
                
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_500'],false,{message:result.message}))
        } else {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{...result}))
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