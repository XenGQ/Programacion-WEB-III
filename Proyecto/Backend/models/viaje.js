module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    taxiId: { type: DataTypes.INTEGER, allowNull: false },
    origen: { type: DataTypes.STRING, allowNull: false },
    destino: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.ENUM('En Curso','Completado','Cancelado'), defaultValue: 'En Curso' }
  }, {
    tableName: 'trips'
  });

  return Trip;
};
