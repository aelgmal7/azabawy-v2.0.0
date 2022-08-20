const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class Credential extends Model {}

Credential.init({
    id:{    
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   
    password:{
        type:DataTypes.STRING, // true for عميل 
        allowNull:true,
        defaultValue:true
    },
   
   
    enabled:{
        type:DataTypes.BOOLEAN,
        defaultValue:true   
    }

    

},{
    sequelize,
    modelName:'credential'
})
Credential.build()


module.exports = {Credential: Credential}