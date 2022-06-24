const express = require("express");
const router = express.Router()
const {createMaterial,getAllMaterials} = require('../Services/MaterialService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.get('/',async (req, res)=> {
    try {
        const result = await getAllMaterials()
        res.send(result)
    }
    catch (err) {
        console.log(err)
    }
})
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