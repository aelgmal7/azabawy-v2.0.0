const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class OrderItem extends Model {}

OrderItem.init(
  {
    id:{    
      type: Sequelize.INTEGER,
        allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
    kiloPrice: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    productNeededWeight: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    delivered: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  {
    sequelize,
    modelName: "orderItem",
  }
);
OrderItem.build();

module.exports = { OrderItem };
