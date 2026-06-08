module.exports = (sequelize, DataTypes) => {
  const Taxi = sequelize.define('Taxi', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero_admin: { type: DataTypes.STRING, allowNull: true, unique: true },
    matricula: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: true },
    chofer_nombre: { type: DataTypes.STRING, allowNull: true },
    chofer_ci: { type: DataTypes.STRING, allowNull: true },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'taxis'
  });

  return Taxi;
};
