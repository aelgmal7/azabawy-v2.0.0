const url = require("url");
const path = require("path");
const express = require("express");
const cors = require('cors')
const bodyParser =require('body-parser')
const temp = require('./temp.ts')
temp.sayHi()
const server = () => {
  
const exp = express();
exp.use(express.json());
exp.use(bodyParser.urlencoded({extended:false}))


exp.use(cors());
const tasks =['ahm3d','aaa']

exp.use('/a',(req,res,next) => {
  res.send(`{
    "name": "samy",
    "age": 48,
    "location": "tanta",
    "physicalStatus": "3bit",
    "mentalStatus": "mt5lf",
    "photo": "https://i.ytimg.com/vi/N8WPmAvZNns/hqdefault.jpg"
}`)
})
exp.get('/tasks',(req,res,next) => {
  res.send(tasks)
})
exp.post('/tasks',(req,res,next) => {
  const r= req.body.title
  console.log(r)
  tasks.push(r)
  res.send(`{"title":"${tasks}"}`)
})
exp.listen(500)


}
//server()
module.exports= {server}
