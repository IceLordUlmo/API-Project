'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) =>
{
  class EventImage extends Model
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
    {
      // define association here
      EventImage.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'cascade'
      })
    }
  }
  EventImage.init({
    eventId: {
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN,
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
