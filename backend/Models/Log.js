const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')

class Log extends Model {}
Log.init(
    {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    reason: {
        type: Sequelize.STRING,
        allowNull:false
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    oldAmount: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    newAmount: {
        type: Sequelize.FLOAT,
        allowNull:false,
    },
    delta: {
        type: Sequelize.FLOAT,
        allowNull:false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},{
    sequelize,
    modelName: 'log',
})
Log.build()
module.exports = {Log: Log}