"use strict";
module.exports = function(sequelize, DataTypes) {
  var tasklist = sequelize.define(
    "tasklist",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return tasklist;
};
