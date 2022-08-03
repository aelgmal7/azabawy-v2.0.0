const express = require("express");
const router = express.Router();
const {
  getClients,
  createClient,
  deleteClient,
  updateClient,
  clientAllOP,
  sendIndividualBill,
  printClientAllOpDetails,
  printClientAllOpShort,
} = require("../Services/ClientService");
const { returnedResult } = require("../Payload/ReturnedResult");
const HTTP_STATUS_CODES = require("../Payload/statusCode.ts");

router.get("/", async (req, res, next) => {
  let result = await getClients();
  try {
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { clients: result })
    );
  } catch (error) {
    console.log(error);
  }
});
router.post("/add-client", async (req, res) => {
  const { clientName, totalBalance, paid } = req.body;
  try {
    const result = await createClient({ clientName, totalBalance, paid });
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_500"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { client: result })
    );
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.delete("/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const result = await deleteClient(clientId);
  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_200"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { client: result })
    );
    return null;
  } catch (error) {}
});

router.put("/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const { clientName, totalBalance, paid } = req.body;
  const result = await updateClient(clientId, clientName, totalBalance, paid);
  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_200"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { client: result })
    );
    return null;
  } catch (error) {}
});

router.get("/conc/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const result = await clientAllOP(clientId);
  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_200"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { op: result })
    );
    return null;
  } catch (error) {}
});

router.post("/individual-bill", async (req, res) => {
  const { type, id } = req.body;
  const result = await sendIndividualBill(type, id);

  try {
    if (result.message) {
      res.send(
        returnedResult(HTTP_STATUS_CODES["CODE_200"], true, {
          message: result.message,
        })
      );
      return null;
    }
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { op: result })
    );
    return null;
  } catch (error) {}
});


router.get('/print-all-ops-details/:clientId',async (req, res)=> {
  const clientId = req.params.clientId;
  const result = await printClientAllOpDetails(clientId);
  try {
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { op: result })
    );
  }catch (error) {}
})

router.get('/print-all-ops-short/:clientId',async (req, res)=> {
  const clientId = req.params.clientId;
  const result = await printClientAllOpShort(clientId);
  try {
    res.send(
      returnedResult(HTTP_STATUS_CODES["CODE_200"], true, { op: result })
    );
  }catch (error) {}
})

module.exports = { clientRouter: router };
