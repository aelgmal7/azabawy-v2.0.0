const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class Order extends Model {}

Order.init(
  {
    id:{    
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
  },
    totalWeight: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    estimatedEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedPrice: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  {
    sequelize,
    modelName: "order",
  }
);
Order.build();

module.exports = { Order };
