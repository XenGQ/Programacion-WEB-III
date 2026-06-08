const sequelize = require('../config/baseDatos');
const { DataTypes } = require('sequelize');

const User = require('./usuario');
const Client = require('./cliente');
const Address = require('./direccion');
const Taxi = require('./taxi');
const Trip = require('./viaje');
const Audit = require('./auditoria');

// Initialize models with sequelize instance
const models = {
  User: User(sequelize, DataTypes),
  Client: Client(sequelize, DataTypes),
  Address: Address(sequelize, DataTypes),
  Taxi: Taxi(sequelize, DataTypes),
  Trip: Trip(sequelize, DataTypes),
  Audit: Audit(sequelize, DataTypes)
};

// Associations
models.Client.hasMany(models.Address, { foreignKey: 'clientId', as: 'addresses', onDelete: 'CASCADE' });
models.Address.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });

models.Client.hasMany(models.Trip, { foreignKey: 'clientId', as: 'trips' });
models.Taxi.hasMany(models.Trip, { foreignKey: 'taxiId', as: 'trips' });
models.Trip.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });
models.Trip.belongsTo(models.Taxi, { foreignKey: 'taxiId', as: 'taxi' });

module.exports = models;
