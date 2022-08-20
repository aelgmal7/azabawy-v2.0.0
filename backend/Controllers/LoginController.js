const express = require("express");
const router = express.Router()
const {login,signUp} = require("../Services/LoginService")
const {returnedResult} = require('../Payload/ReturnedResult')
const HTTP_STATUS_CODES =require('../Payload/statusCode.ts')

router.post('/',async (req, res)=>{

    const {userName,password} = req.body
    const result = await login(userName,password)
    res.send(result)
    // const credentials = [{
    //     userName:'mohamed',
    //     password:'1234'
    // }]
    // credentials.find((user)=> user.userName == userName || user.password == password)? res.send({success:true }) : res.send({success:false})
})
router.post('/signup',async (req, res)=>{
    const {userName,password,key} = req.body
    const validKey = 'osama2022'
    if (key != validKey) {
        res.send({success:false,message:'مفتاح خاطئ'})
        return 
    }
    const result = await signUp(userName, password)
    if (result.message){
        
        res.send(  returnedResult(HTTP_STATUS_CODES["CODE_500"], false, {  message: result.message, }))
    }else{
        res.send(  returnedResult(HTTP_STATUS_CODES["CODE_200"], true,true))
    }


})
module.exports = {

    loginRouter:router
}