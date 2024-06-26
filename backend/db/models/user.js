"use strict";
const { Model, Validator } = require("sequelize");
// const { options } = require("../../routes");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.Spot, {
      //   foreignKey: "ownerId",
      //   onDelete: "CASCADE",
      //   hooks: true,
      // });

      // User.belongsToMany(models.Spot, {
      //   through: models.Booking,
      //   foreignKey: "userId",
      //   otherKey: "spotId",
      // });
      // User.belongsToMany(models.Spot, {
      //   through: models.Review,
      //   foreignKey: "userId",
      //   otherKey: "spotId",
      // });
      User.hasMany(models.Spot, {
        foreignKey: "ownerId",
        onDelete: "CASCADE",
        // hooks: true,
      });
      User.hasMany(models.Booking, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        // hooks: true,
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        // hooks: true,
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("cannot be email");
            }
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
    }
    // options
  );
  return User;
};
