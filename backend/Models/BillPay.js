const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class BillPay extends Model {} 
BillPay.init({
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    money: {
        type:Sequelize.FLOAT,
        allowNull:false
    },
    note: {
        type:Sequelize.STRING,
        allowNull: true
    },
    date: { 
        type:DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    enabled:{
        type:DataTypes.BOOLEAN,
        defaultValue:true   
    }

},{
        sequelize,
        modelName:'billPay'
})
BillPay.build()
module.exports = {BillPay}