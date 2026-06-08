require('dotenv').config();
const db = require('../config/baseDatos');
const models = require('../models/indice');

(async () => {
  try {
    await db.authenticate();
    console.log('DB connected');
    await db.sync();
    const User = models.User;
    
    // Create operator user
    const operator = await User.findOne({ where: { username: 'operador' } });
    if (!operator) {
      await User.create({ username: 'operador', passwordHash: 'Operador123!', role: 'operador' });
      console.log('Operator user created: username=operador password=Operador123!');
    } else {
      console.log('Operator already exists');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
