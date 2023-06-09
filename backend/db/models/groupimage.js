'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) =>
{
  class GroupImage extends Model
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
    {
      // define association here
      GroupImage.belongsTo(models.Group, {
        foreignKey: 'groupId',
        onDelete: 'cascade'
      })
    }
  }
  GroupImage.init({
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN,
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      onDelete: 'cascade',
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
