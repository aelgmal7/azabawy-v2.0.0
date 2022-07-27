const {Pay} = require('../Models/Pay')
const {Client} = require('../Models/Client')

const getAllPayOperations = async() => {
    return await Pay.findAll({where: {enabled: true}})

}


const addPayOperations = async(money , date , note= null) => {
   return await Pay.create({money, date, note}).then((pay) => {
     return pay
   })
    
}




module.exports = {
    getAllPayOperations,
    addPayOperations
}