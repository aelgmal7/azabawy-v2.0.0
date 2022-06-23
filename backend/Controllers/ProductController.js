const express = require("express");
const router = express.Router()
const {getProducts, createProduct} = require('../Services/ProductService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.get('/',async (req, res) => {

    let result = await getProducts()
    try {
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

module.exports = {productRouter:router}