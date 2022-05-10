const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class OrderDetails extends Model {}

OrderDetails.init(
  {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OrderId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    delivered: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  {
    sequelize,
    modelName: "orderDetails",
  }
);
OrderDetails.build();

module.exports = { OrderDetails };
