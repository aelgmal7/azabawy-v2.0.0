
const {Credential} = require('../Models/Credential')

const login = async (userName, password) => {
    const user = await Credential.findOne({where:{enabled: true,userName, password}})
    if (user==null) {
        return false
    }else {
        return true
    }
}
const signUp = async (userName, password) => {
    
    if (userName ==undefined|| password ==undefined) {
        return {
            message:`bad request`
        }
    }
    const userCheck = await Credential.findOne({where:{enabled:true,userName,password}})
    if (userCheck==null) {

        return Credential.create({userName, password})
    }else {
        return {
            message:`user already exists`
        }
    }
}

module.exports = {
    login,
    signUp
}