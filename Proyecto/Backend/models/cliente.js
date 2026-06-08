module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    celular: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    tableName: 'clients'
  });

  return Client;
};
