const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class WeightAndAmountMat extends Model {}

WeightAndAmountMat.init(
  {
    id:{    
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    materialName :{    
        type:Sequelize.STRING,
       
  },
    weight :{
        type:Sequelize.INTEGER,
        allowNull: false,
        
        
    },
    amount :{ 
        type:Sequelize.INTEGER,
        allowNull: true
    }
  },
  {
    sequelize,
    modelName: "weightAndAmountMat",
  }
);
WeightAndAmountMat.build();

module.exports = {WeightAndAmountMat};
