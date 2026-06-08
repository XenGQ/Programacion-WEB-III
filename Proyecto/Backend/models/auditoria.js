module.exports = (sequelize, DataTypes) => {
  const Audit = sequelize.define('Audit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    action: { type: DataTypes.STRING, allowNull: false },
    entity: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: true },
    details: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'audits'
  });

  return Audit;
};
