const {DirectPay} = require('../Models/DirectPay')
const {Client} = require('../Models/Client')

const getAllDirectPayOperations = async() => {
    return await DirectPay.findAll({where: {enabled: true}})

}


const addDirectPayOperations = async(clientId,money , date , note= null) => {
    return Client.findOne({where: {enabled: true,id: clientId}})
    .then((client) => {
        if (!client) {
            return {
                message: `no client with id ${clientId}`,
                code: 404,
            }
        }
        return client.createDirectPay({money:money,date:date,note:note})
    })
    
}




module.exports = {
    getAllDirectPayOperations,
    addDirectPayOperations
}