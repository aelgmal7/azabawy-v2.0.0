const express = require("express");
const router = express.Router()
const {
     getAllSuppliers,
     getSupplierMaterials,
     addSupplier,
     deleteSupplier,
    } = require("../Services/SuppliedService")
const {returnedResult} = require('../Payload/ReturnedResult')
const {HTTP_STATUS_CODES} =require('../Payload/statusCode.ts')


router.get('/',async (req, res)=> {
    const result = await getAllSuppliers()
    try {
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{suppliers:result}))
    }
    catch (err){}
})
router.get('/:supplierId',async (req, res)=> {
    const supplierId = req.params.supplierId
    const result = await getSupplierMaterials(supplierId)
    try {
        if(result.message) {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
            return ;
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{materials:result}))
    }
    catch (err){}
})
router.post('/add-supplier',async (req, res)=>{

    const payload =req.body
    const result = await addSupplier(payload)
    try {
        if(result.message) {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
            return ;
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{supplier:result}))
    }
    catch (err){}
})
router.delete('/:supplierId',async (req, res)=> {
    const supplierId = req.params.supplierId
    const result = await deleteSupplier(supplierId)
    try {
        if(result.message) {

            res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{message:result.message}))
            return ;
        }
        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{supplier:result}))
    }catch (err){}
})
module.exports ={supplierRouter:router}