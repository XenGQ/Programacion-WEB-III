const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin','operador'), defaultValue: 'operador' }
  }, {
    tableName: 'users'
  });

  User.prototype.verifyPassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.beforeCreate(async (user) => {
    if (user.passwordHash && user.passwordHash.length < 60) {
      const hash = await bcrypt.hash(user.passwordHash, 10);
      user.passwordHash = hash;
    }
  });

  return User;
};
