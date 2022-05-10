const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class Product extends Model {}

Product.init(
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amounts: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    weights: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalWeight: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    alarm: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    // completed: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    // },
    // delivered: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    // },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "product",
  }
);
Product.build();

module.exports = { Product };
