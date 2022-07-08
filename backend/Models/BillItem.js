const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')
class BillItem extends Model {}
BillItem.init({ 
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    productName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    weight: {
        type:Sequelize.FLOAT,
        allowNull:false
    },
    amount: {
        type:Sequelize.FLOAT,
        allowNull:false,
    },
    kiloPrice: {
        type:Sequelize.FLOAT,
        allowNull:false
    },
    enabled:{
        type:DataTypes.BOOLEAN,
        defaultValue:true   
    }

},
{
    sequelize,
    modelName:'billItem'
})
BillItem.build();
module.exports = {BillItem}