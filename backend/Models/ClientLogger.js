const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')

class ClientLogger extends Model {}
ClientLogger.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    oldTotalBalance: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    oldPaid: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    newTotalBalance: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    newPaid: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    enabled: {
        type: Sequelize.BOOL,
        defaultValue: true,
    }
},{
    sequelize,
    modelName: 'clientLogger',
})
ClientLogger.build();

module.exports = {ClientLogger}