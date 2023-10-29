'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      });

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      });

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId',
        as: 'Memberships'
      });

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'Organizer'
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        verifyLongEnough(value) {
          if (!value.length || value.length < 50) {
            throw new Error('About must be 50 characters or more');
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person')
    },
    private: DataTypes.BOOLEAN,
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
