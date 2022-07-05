const express = require("express");
const router = express.Router()
const {createOrder,getOrderById,getOrderItemsAsProduct,getAllOrders,changeOrderItemsDeliveredWeight,deleteOrder,getAllCompletedOrders} = require('../Services/OrderService')
const {returnedResult} = require('../Payload/ReturnedResult')
const {HTTP_STATUS_CODES} =require('../Payload/statusCode.ts')




router.get("/",async  (req, res) => {
    let result = await getAllOrders()
    res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{orders:result}))

    //TODO not completed 
})
router.get("/uncompleted",async  (req, res) => {
    let result = await getAllCompletedOrders()
    res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{orders:result}))

    //TODO not completed 
})


router.post("/change-delivered/:orderId", async (req, res) => {
    let orderId = req.params.orderId;
    let clientId = req.query.clientId;
    let orderItemsArr = req.body;
    let result = await changeOrderItemsDeliveredWeight(clientId, orderId,orderItemsArr)
    try {
        // console.log("sadfgh", result)
        if(result.message) {
                
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_500'],false,{message:result.message}))
        } else {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{order:result}))
        }

    }catch(error){
    }
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

 router.delete('/delete/:orderId',async (req, res, next)=>{

    const orderId = req.params.orderId
    const result = await deleteOrder(orderId)
    try { 
        if(result.message) {
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],true,result.message))
        }else {
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{items:result}))

        }
    }catch(err) {}
 })


 module.exports ={orderRouter:router}