const {DirectPay} = require('../Models/DirectPay')
const {Client} = require('../Models/Client')

const getAllDirectPayOperations = async() => {
    return await DirectPay.findAll({where: {enabled: true}})

}


const addDirectPayOperations = async(clientId,money , date , note= null) => {
    console.log(money);
    return Client.findOne({where: {enabled: true,id: clientId}})
    .then((client) => {
        if (!client) {
            return {
                message: `no client with id ${clientId}`,
                code: 404,
            }
        }
        client.paid += money
        client.remain -= money
        client.save()
        return client.createDirectPay({money:money,date:date,note:note}).then(pay => {
            pay.remainAfterOp = client.remain
            pay.save
            return pay 
        })
    })
    
}




module.exports = {
    getAllDirectPayOperations,
    addDirectPayOperations
}