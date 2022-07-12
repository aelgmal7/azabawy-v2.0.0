// const url = require("url");
// const path = require("path");
const express = require("express");
const cors = require('cors')
const html_to_pdf = require('html-pdf-node');
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')



const bodyParser =require('body-parser')
const temp = require('./temp.ts')
const {relations} = require('./Relations')
relations()
// import {returnedResult} from './Payload/ReturnedResult.js'
// import {HTTP_STATUS_CODES} from './Payload/statusCode.ts' ;
const HTTP_STATUS_CODES =require('./Payload/statusCode.ts')
const {returnedResult} =require('./Payload/ReturnedResult')
const  {sequelize} = require('./DataBase/index')
 const  {clientRouter} = require('./Controllers/ClientController')
 const  {productRouter} = require('./Controllers/ProductController')
 const  {orderRouter} = require('./Controllers/OrderController')
 const  {materialRouter} = require('./Controllers/MaterialController')
 const {supplierRouter} = require('./Controllers/SupplierController')
 const {billRouter} = require('./Controllers/BillController')
 const {directPayRouter} = require('./Controllers/DirectPayController')
 
 temp.sayHi()
 const server = () => {
   const app = express();

   app.set('view engine', 'ejs')
   app.set("views","views")
   app.use(express.json());
   app.use(bodyParser.urlencoded({extended:false}))
   app.use(cors());
   
    app.use('/client',clientRouter);
    app.use('/product',productRouter);
    app.use('/order',orderRouter);
    app.use('/material',materialRouter);
    app.use('/supplier',supplierRouter);
    app.use('/bill',billRouter);
    app.use('/directPay',directPayRouter)
   // console.log(Client === sequelize.models.Client); // true
   


 
  sequelize.sync(
  // {force: true}
  ).then(result => {
    app.listen(3000)

  }).catch(error => console.log(error))
}

module.exports = {server}
