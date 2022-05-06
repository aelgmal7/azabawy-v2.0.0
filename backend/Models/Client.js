const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class Client extends Model {}

Client.init({
    clientName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    phoneNumber:{
        type:DataTypes.NUMBER,
        allowNull:true
    },
    type:{
        type:DataTypes.BOOLEAN, // true for عميل 
        allowNull:true,
        defaultValue:true
    },
    typeString:{
        type:DataTypes.STRING,
        allowNull:true   
    },
    totalBalance: {
        type:DataTypes.FLOAT,
        allowNull:true,
        defaultValue: 0.0,
        
    },
    paid: {
        type:DataTypes.FLOAT,
        allowNull:true,
        defaultValue: 0.0,

    },
    remain: {
        type:DataTypes.FLOAT,
        allowNull:true,
        defaultValue: 0.0,

    },
    posVsNeg:{
        type:DataTypes.BOOLEAN,
        get(){
            if(this.getDataValue('type')) {

                const delta = this.getDataValue('totalBalance') - this.getDataValue('remain') //TODO brain storming here
                return delta? true : false
            }
        }
    },
    orders:{
        type:DataTypes.STRING,
        defaultValue: ''
    },
    bills:{
        type:DataTypes.STRING,
        defaultValue: ''
    },
    paying:{
        type:DataTypes.STRING,
        defaultValue: ''
    },
    enabled:{
        type:DataTypes.BOOLEAN,
        defaultValue:true   
    }

    

},{
    sequelize,
    modelName:'Client'
})
Client.build()


module.exports = {Client}