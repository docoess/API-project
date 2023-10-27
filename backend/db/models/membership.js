'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      validate: {
        [Op.in]: ['co-host', 'member', 'pending']
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
