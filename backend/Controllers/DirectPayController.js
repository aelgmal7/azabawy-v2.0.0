const express = require("express");
const router = express.Router();
const {
  getAllDirectPayOperations,
  addDirectPayOperations,
} = require("../Services/DirectPayService");
const {
  getAllPayOperations,
  addPayOperations,
} = require("../Services/PayService")
const { returnedResult } = require("../Payload/ReturnedResult");
const { HTTP_STATUS_CODES } = require("../Payload/statusCode.ts");

router.get("/", async (req, res) => {
  const result = await getAllDirectPayOperations();
  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_500"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { pay: result })
    );
  } catch (err) {}
});

router.post("/add-directPay/", async (req, res) => {
  const clientId = req.query.clientId;
  console.log(clientId);
  const { cash:money, date, note } = req.body;
  let result ;
  if ( clientId == 'null'){

    result = await addPayOperations( money, date, note);
  }else {

     result = await addDirectPayOperations(clientId, money, date, note);
  }
  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_500"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { pay: result })
    );
  } catch (e) {}
});

module.exports = { directPayRouter: router };
