const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class Material extends Model {}

Material.init(
  {
    id:{    
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    materialName: {
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

    unit: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "material",
  }
);
Material.build();

module.exports = {Material};
