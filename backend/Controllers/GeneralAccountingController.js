const express = require("express");
const router = express.Router();
const {
  getAllOp,
  openIndividual,
  deleteOperation
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

router.delete('/',async (req, res)=>{
  const {opType,opId}= req.query
  console.log(opType,opId);
  const result = await deleteOperation(opType,opId)
  res.send(returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { operation: {type: 'delete'} }))
})

module.exports = {
    accountingRouter:router
}