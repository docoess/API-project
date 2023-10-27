'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      });

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });

      Event.belongsTo(model.Venue, {
        foreignKey: 'venueId'
      });
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venues',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        verifyLongEnough(value) {
          if (!value.length || value.length < 5) {
            throw new Error('Name must be at least 5 characters');
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      validate: {
        type: {
          [Op.in]: ['Online', 'In person']
        }
      }
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      validate: {
        verifyInFuture(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Start date must be in the future');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        verifyAfterStart(value) {
          if (new Date(value) < this.startDate) {
            throw new Error('End date is less than start date');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
