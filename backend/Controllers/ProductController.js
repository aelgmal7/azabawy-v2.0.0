const express = require("express");
const router = express.Router()
const {getProducts, createProduct,deleteProduct,deleteProductWeight,addNewWeightToProduct,updateProduct} = require('../Services/ProductService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.get('/',async (req, res) => {

    let result = await getProducts()
    try {
        if(result.message){

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_500'],false,{message:result.message}))
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{products:result}))
    }catch (err) {
        console.error(err)
        
    }
})

router.post('/add-product',async (req, res) => {
    try {
        const {productName,weightsAndAmounts,kiloPrice,alarm,type} = req.body
        const result = await createProduct({productName,weightsAndAmounts,kiloPrice,alarm,type})
        res.send(result)
    }catch (err) {
        console.error(err)
    }
})
router.post('/add-weights-and-amounts/:productId',async (req, res)=>{
    const id = req.params.productId
    const {weight, amount} = req.body
    result = await addNewWeightToProduct(id, weight, amount)
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{weight:result}))

    }catch(e) {}
})
router.put('/update-product/:productId',async (req, res)=>{
    const id = req.params.productId;
    const {productName,kiloPrice,alarm} = req.body
    const result = await updateProduct(id, productName,alarm,kiloPrice)
    try {
        if (result.message){
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{product:result}))

    }catch(e){}
})
router.delete('/:productId',async(req,res,next)=> {
    const id = req.params.productId
    let result = await deleteProduct(id)
    try {
        if(result.message) {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{products:result}))
    }catch (err) {
        console.error(err)
        
    }
})
router.delete('/deleteProductWeight/:productId',async (req, res)=> {
    const id = req.params.productId
    const productWeight = req.query.productWeight
    const result = await deleteProductWeight(id,productWeight)
    res.send(result)

})

module.exports = {productRouter:router}