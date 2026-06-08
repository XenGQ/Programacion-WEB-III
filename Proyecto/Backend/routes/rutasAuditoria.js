const express = require('express');
const router = express.Router();
const auditController = require('../controllers/controladorAuditoria');

const ensureAdmin = (req, res, next) => {
  const user = req.session?.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};

router.get('/', ensureAdmin, auditController.listAudits);

module.exports = router;
