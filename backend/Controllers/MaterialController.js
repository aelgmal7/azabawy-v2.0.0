const express = require("express");
const router = express.Router()
const {
    createMaterial,
    getAllMaterials,
    deleteMaterial
} = require('../Services/MaterialService')
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
            if(result.message){

                res.send(returnedResult( HTTP_STATUS_CODES['CODE_500'],false,{message:result.message}))
            }else {

                res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{result}))
            }
        }catch (err) {
        console.error(err)
    }
})
router.delete("/:materialId", async (req, res)=> {
    const materialId = req.params.materialId
    const result = await deleteMaterial(materialId)
    try {
        if(result.message){
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{result}))            
        }else{
            res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{result}))

        }
    }catch (err) {}

})

module.exports = {materialRouter:router}