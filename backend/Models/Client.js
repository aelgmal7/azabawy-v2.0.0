const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class Client extends Model {}

Client.init({
    id:{    
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   
    type:{
        type:DataTypes.BOOLEAN, // true for عميل 
        allowNull:true,
        defaultValue:true
    },
    typeString:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:  "عميل" 
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