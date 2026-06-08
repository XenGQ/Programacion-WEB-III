require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/baseDatos');

const authRoutes = require('./routes/rutasAutenticacion');
const clientRoutes = require('./routes/rutasClientes');
const taxiRoutes = require('./routes/rutasTaxis');
const tripRoutes = require('./routes/rutasViajes');
const auditRoutes = require('./routes/rutasAuditoria');

const app = express();
const PORT = process.env.PORT || 3000;

//Frontend corriendo en puerto 4000//
app.use(cors({ origin: 'http://localhost:4000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/taxis', taxiRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/audits', auditRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return res.status(400).json({ message: `${field} ya está en uso` });
  }
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors[0].message });
  }
  
  res.status(err.status || 500).json({ message: err.message || 'Error del servidor' });
});

//Sincronizar la base de datos//
(async () => {
  try {
    await db.sync({ alter: true });
    console.log('Base de datos sincronizado');
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  } catch (err) {
    console.error('Error al sincronizar la base de datos:', err);
  }
})();
