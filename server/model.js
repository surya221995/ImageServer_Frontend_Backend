const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("imageserver", "postgres", "bajaj", {
  host: "localhost",
  dialect: "postgres"
});

const Product = sequelize.define("Product", {
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color_code: {
    type: DataTypes.STRING
  },
  color_desc: {
    type: DataTypes.STRING
  },
  wheel_selection : {
    type: DataTypes.STRING
  },
  file_type: {
    type: DataTypes.STRING
  },
  image_data: {
    type: DataTypes.BLOB("long")
  }
});

module.exports = { sequelize, Product };
