const express = require("express");
const router = express.Router();
const {
  getAllOp,
  openIndividual
} = require("../Services/GeneralAccountingService");
const { returnedResult } = require("../Payload/ReturnedResult");
const HTTP_STATUS_CODES = require("../Payload/statusCode.ts");


router.get("/",async (req, res)=> {
    result = await getAllOp();
    try {

        res.send(
            returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { operations: result })
          );
    }catch(err){}
})

router.post('/individual',async (req, res)=>{
    const {id,type} = req.body
    const result = openIndividual(id,type)
    res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { operation: result })
      );
})

module.exports = {
    accountingRouter:router
}