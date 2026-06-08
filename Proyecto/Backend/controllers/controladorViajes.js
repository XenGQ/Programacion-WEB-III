const models = require('../models/indice');
const Trip = models.Trip;
const Client = models.Client;
const Taxi = models.Taxi;
const Audit = models.Audit;

const recordAudit = async (action, entity, entityId, details) => {
  await Audit.create({ action, entity, entityId, details });
};

const listTrips = async (req, res) => {
  const trips = await Trip.findAll({ include: [ { model: Client, as: 'client' }, { model: Taxi, as: 'taxi' } ], order: [['createdAt','DESC']] });
  res.json(trips);
};

const createTrip = async (req, res) => {
  const { clientId, taxiId, origen, destino } = req.body;
  if (!clientId || !taxiId || !origen) return res.status(400).json({ message: 'clientId, taxiId y origen son requeridos' });

  const client = await Client.findByPk(clientId);
  const taxi = await Taxi.findByPk(taxiId);
  if (!client) return res.status(400).json({ message: 'Cliente no válido' });
  if (!taxi) return res.status(400).json({ message: 'Taxi no válido' });

  const trip = await Trip.create({ clientId, taxiId, origen, destino, estado: 'En Curso' });
  taxi.disponible = false;
  await taxi.save();

  await recordAudit(
    'Creación de viaje',
    'Trip',
    trip.id,
    `Cliente ${client.nombre} - Taxi ${taxi.numero_admin || taxi.id} - Origen ${origen} - Destino ${destino || 'sin destino'}`
  );

  res.status(201).json(trip);
};

const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const trip = await Trip.findByPk(id);
  if (!trip) return res.status(404).json({ message: 'Viaje no encontrado' });
  await trip.update({ estado: estado || trip.estado });
  if (estado === 'Completado' || estado === 'Cancelado') {
    const taxi = await Taxi.findByPk(trip.taxiId);
    const client = await Client.findByPk(trip.clientId);
    if (taxi) { taxi.disponible = true; await taxi.save(); }
    await recordAudit(
      'Actualización de viaje',
      'Trip',
      trip.id,
      `Viaje ${trip.id} - Cliente ${client?.nombre || 'desconocido'} - Taxi ${taxi?.numero_admin || taxi?.id || 'desconocido'} marcado como ${estado}`
    );
  }
  res.json(trip);
};

const deleteTrip = async (req, res) => {
  const { id } = req.params;
  const trip = await Trip.findByPk(id);
  if (!trip) return res.status(404).json({ message: 'Viaje no encontrado' });
  await trip.destroy();
  await recordAudit('Eliminación de viaje', 'Trip', id, `Viaje ${id} eliminado`);
  res.json({ message: 'Viaje eliminado' });
};

module.exports = { listTrips, createTrip, updateTrip, deleteTrip };
