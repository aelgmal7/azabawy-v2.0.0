const {
Log
} = require('../Models/Log')


const createLog = async (date,name,weight,oldAmount,newAmount,delta) => {
    const log = await  Log.create(  {
        date,name,weight,oldAmount,newAmount,delta
    })
    return log

}
const getAllLogs = async() => {
    const logs =await Log.findAll()
    return logs
}
module.exports = {
    createLog: createLog,
    getAllLogs:getAllLogs

}