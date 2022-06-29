const { Sequelize, Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase");
class WeightAndAmount extends Model {}

WeightAndAmount.init(
  {
    id:{    
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    productName :{    
        type:Sequelize.STRING,
       
  },
    weight :{
        type:Sequelize.INTEGER,
        allowNull: false,
        
        
    },
    amount :{ 
        type:Sequelize.INTEGER,
        allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: "weightAndAmount",
  }
);
WeightAndAmount.build();

module.exports = { WeightAndAmount };
