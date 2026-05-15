const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("practica", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;