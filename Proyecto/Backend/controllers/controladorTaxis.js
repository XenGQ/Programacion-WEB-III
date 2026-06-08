const models = require('../models/indice');
const Taxi = models.Taxi;

const listTaxis = async (req, res) => {
  const taxis = await Taxi.findAll();
  res.json(taxis);
};

const createTaxi = async (req, res) => {
  const { numero_admin, matricula, modelo, chofer_nombre, chofer_ci } = req.body;
  if (!matricula) return res.status(400).json({ message: 'Matrícula requerida' });
  const taxi = await Taxi.create({ numero_admin: numero_admin || null, matricula, modelo, chofer_nombre, chofer_ci });
  res.status(201).json(taxi);
};

const updateTaxi = async (req, res) => {
  const { id } = req.params;
  const taxi = await Taxi.findByPk(id);
  if (!taxi) return res.status(404).json({ message: 'Taxi no encontrado' });
  await taxi.update(req.body);
  res.json(taxi);
};

const toggleDisponibilidad = async (req, res) => {
  const { id } = req.params;
  const taxi = await Taxi.findByPk(id);
  if (!taxi) return res.status(404).json({ message: 'Taxi no encontrado' });
  taxi.disponible = !taxi.disponible;
  await taxi.save();
  res.json(taxi);
};

const deleteTaxi = async (req, res) => {
  const { id } = req.params;
  const taxi = await Taxi.findByPk(id);
  if (!taxi) return res.status(404).json({ message: 'Taxi no encontrado' });
  await taxi.destroy();
  res.json({ message: 'Taxi eliminado' });
};

module.exports = { listTaxis, createTaxi, updateTaxi, toggleDisponibilidad, deleteTaxi };
