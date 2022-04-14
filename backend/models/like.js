"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      /*models.Like.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: "idUSERS",
        },
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          name: "idPOSTS",
        },
      });*/
    }
  }
  Like.init(
    {
      idUSERS: DataTypes.INTEGER,
      idPOSTS: DataTypes.INTEGER,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
