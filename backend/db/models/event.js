'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) =>
{
  class Event extends Model
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
    {
      // define association here
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId',
        onDelete: 'cascade'
      })
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId',
        onDelete: 'cascade'
      })
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })
      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId'
      })
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: {
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM(['Online', 'In Person']),
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
