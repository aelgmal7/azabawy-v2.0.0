const express = require("express");
const router = express.Router();
const { 
    createLog,
    getAllLogs
 } = require("../Services/LogService")


const { returnedResult } = require("../Payload/ReturnedResult");
const HTTP_STATUS_CODES = require("../Payload/statusCode.ts");

router.get('/', async(req, res)=> {

    const result =  await getAllLogs();
    //  [{
    //     id:1,
    //     date : new Date(),
    //     name:"mo3",
    //     reason: " فاتروه بيع رقم 5 ",
    //     weight: 20,
    //     oldAmount: 15,
    //     newAmount:10,
    //     delta: -5
    // }]
    res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{result}))

})

module.exports = {
    logRouter:router
}