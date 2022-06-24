const express = require("express");
const router = express.Router()
const {createMaterial} = require('../Services/MaterialService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.post('/add-material',async (req, res)=> {
    try {
        const {materialName,weightsAndAmountsMat,kiloPrice,unit,alarm,supplierId} = req.body
        const result = await createMaterial({
            materialName,
            weightsAndAmountsMat,
            kiloPrice,
            unit,
            alarm,
            supplierId})
        res.send(result)
    }catch (err) {
        console.error(err)
    }
})

module.exports = {materialRouter:router}