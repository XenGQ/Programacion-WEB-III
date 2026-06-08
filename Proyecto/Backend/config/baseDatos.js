const { Sequelize } = require('sequelize');
require('dotenv').config();

let dialectModule;
try {
  dialectModule = require('mysql2');
} catch (e) {
  dialectModule = require('mysql');
}

const sequelize = new Sequelize(process.env.DB_NAME || 'radiotaxi', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  dialectModule: dialectModule,
  logging: false,
});

module.exports = sequelize;
