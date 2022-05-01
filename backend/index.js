// const url = require("url");
// const path = require("path");
const express = require("express");
const cors = require('cors')
const bodyParser =require('body-parser')
const temp = require('./temp.ts')
import {returnedResult} from './Payload/ReturnedResult.js'
import {HTTP_STATUS_CODES} from './Payload/statusCode.ts' ;

temp.sayHi()
const server = () => {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(cors());

  const tasks =['ahm3d','aaa']

  app.use('/a',(req,res,next) => {
    res.send(`{
      "name": "samy",
      "age": 48,
      "location": "tanta",
      "physicalStatus": "3bit",
      "mentalStatus": "mt5lf",
      "photo": "https://i.ytimg.com/vi/N8WPmAvZNns/hqdefault.jpg"
    }`)
  })

  app.get('/tasks',(req,res,next) => {
    res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{title:tasks}))
  })

  app.post('/tasks',(req,res,next) => {
    const r= req.body.title
    console.log(returnedResult('CODE_200',true,{title:tasks}))
    if(r === undefined){
      throw new Error('no data sent')
    }
    console.log(r)
    tasks.push(r)
    res.send(returnedResult( HTTP_STATUS_CODES['CODE_200'],true,{title:tasks}))
  })

  app.listen(3000)
}

module.exports = server
