module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    calle: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.STRING, allowNull: true },
    ciudad: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'addresses'
  });

  return Address;
};
