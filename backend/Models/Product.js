const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class Product extends Model {}

Product.init(
  {
    id:{    
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalWeight: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
   
    kiloPrice: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    alarm: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: "product",
  }
);
Product.build();

module.exports = { Product };
