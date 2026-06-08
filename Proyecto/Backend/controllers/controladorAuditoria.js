const models = require('../models/indice');
const Audit = models.Audit;

const listAudits = async (req, res) => {
  const audits = await Audit.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
  res.json(audits);
};

module.exports = { listAudits };
