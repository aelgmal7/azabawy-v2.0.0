const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')

class Bill extends Model {}
Bill.init({
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type:Sequelize.STRING,
        allowNull: false,
        defaultValue: "بيع"
       
    },
    cost: {
        type:Sequelize.FLOAT,
        allowNull: false
    },
    paid: {
        type:Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    remainAfterOp : {
        type:Sequelize.FLOAT,
        allowNull: false,
        defaultValue:0.0
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
},
{
    sequelize,
    modelName:'Bill'
})
Bill.build()
module.exports = {Bill}