require('dotenv').config();
const db = require('../config/baseDatos');
const models = require('../models/indice');

(async () => {
  try {
    await db.authenticate();
    console.log('DB connected');
    await db.sync();
    const User = models.User;
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      await User.create({ username: 'admin', passwordHash: 'Admin123!', role: 'admin' });
      console.log('Admin user created: username=admin password=Admin123!');
    } else {
      console.log('Admin already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
