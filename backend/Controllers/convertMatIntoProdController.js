const express = require("express");
const router = express.Router();
const {convertMat} = require("../Services/convertMatIntoProdService")
const { returnedResult } = require("../Payload/ReturnedResult");
const HTTP_STATUS_CODES = require("../Payload/statusCode.ts");

router.post('/create', async(req, res)=> {
    const {materialInfo,productInfo} = req.body
    const result = await convertMat(materialInfo,productInfo)
    
    if(result.message){

        res.send(returnedResult( HTTP_STATUS_CODES['CODE_404'],false,{result}))
    }else {

        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{result}))
    }

})

module.exports = {
    convertMat:router
}