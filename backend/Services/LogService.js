const {
Log
} = require('../Models/Log')


const createLog = async (date,name,reason,weight,oldAmount,newAmount,delta) => {
    const log = await  Log.create(  {
        date,name,reason,weight,oldAmount,newAmount,delta
    })
    return log

}
const getAllLogs = async() => {
    const logs =await Log.findAll({order:[['date','DESC']]})
    return logs
}
module.exports = {
    createLog: createLog,
    getAllLogs:getAllLogs

}