const express = require("express");
const router = express.Router()
const {getProducts, createProduct,deleteProduct,deleteProductWeight} = require('../Services/ProductService')
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
        const {productName,weightsAndAmounts,kiloPrice,alarm} = req.body
        const result = await createProduct({productName,weightsAndAmounts,kiloPrice,alarm})
        res.send(result)
    }catch (err) {
        console.error(err)
    }
})
router.get('/:productId',async(req,res,next)=> {
    const id = req.params.productId
    let result = await deleteProduct(id)
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{products:result}))
    }catch (err) {
        console.error(err)
        
    }
})
router.get('/deleteProductWeight/:productId',async (req, res)=> {
    const id = req.params.productId
    const productWeight = req.query.productWeight
    const result = await deleteProductWeight(id,productWeight)
    res.send(result)

})

module.exports = {productRouter:router}