const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class Supplier extends Model {}

Supplier.init({
    id:{    
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    supplierName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    type:{
        type:DataTypes.BOOLEAN, // true for عميل 
        allowNull:true,
        defaultValue:false
    },
    typeString:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:  "مورد" 
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
    modelName:'Supplier'
})
Supplier.build()


module.exports = { Supplier}