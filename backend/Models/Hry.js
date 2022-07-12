const  { Sequelize, Model, DataTypes } = require('sequelize');
const {sequelize} = require('../DataBase')

class Hry extends Model {}
Hry.init(
    {
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        comments: {
            type:DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: 'hry'
    }
)
Hry.build();
module.exports = {Hry}