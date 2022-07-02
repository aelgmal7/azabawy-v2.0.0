const express = require("express");
const router = express.Router()
const {getClients, createClient} = require('../Services/ClientService')
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')


 router.get('/',async (req, res, next) =>{
     
    let result =await getClients()
    try {

        res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{clients:result}))
    }catch(error){
        console.log(error)
    }
 
 })
 router.post('/add-client', async (req, res) => {
     try {
         const {clientName,phoneNumber,totalBalance, paid, remain,orders, bills,paying} = req.body

         const result = await createClient({clientName,phoneNumber, totalBalance, paid, remain,orders, bills,paying})
         res.send(result)
         console.log(req.body)
        }catch (error){
            console.log(error)
            res.send(error.message)
     }

 })
const show =() => console.log("sdfghjghj",getClient)

 module.exports = {clientRouter:router}