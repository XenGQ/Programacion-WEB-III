const models = require('../models/indice');
const Client = models.Client;
const Address = models.Address;
const Audit = models.Audit;
const { validateBoliviaPhone } = require('../utils/validadores');

const recordAudit = async (action, entity, entityId, details) => {
  await Audit.create({ action, entity, entityId, details });
};

const listClients = async (req, res) => {
  const clients = await Client.findAll({
    include: [{ model: Address, as: 'addresses' }],
    order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']]
  });
  res.json(clients);
};

const createClient = async (req, res) => {
  const { nombre, celular, addresses } = req.body;
  if (!nombre || !celular) return res.status(400).json({ message: 'Nombre y celular requeridos' });
  if (!validateBoliviaPhone(celular)) return res.status(400).json({ message: 'Celular no válido' });
  if (!Array.isArray(addresses) || addresses.length < 2) return res.status(400).json({ message: 'Se requieren al menos 2 direcciones (origen y destino)' });
  
  for (const addr of addresses) {
    if (!addr.calle || addr.calle.trim() === '') {
      return res.status(400).json({ message: 'Todas las direcciones deben tener una calle válida' });
    }
  }

  const client = await Client.create({ nombre, celular });
  for (const addr of addresses.slice(0,5)) {
    await Address.create({ clientId: client.id, calle: addr.calle.trim(), numero: addr.numero?.trim() || null, ciudad: addr.ciudad?.trim() || null });
  }

  await recordAudit('Registro de cliente', 'Client', client.id, `Cliente ${nombre} registrado con ${addresses.length} direcciones`);

  const created = await Client.findByPk(client.id, {
    include: [{ model: Address, as: 'addresses' }],
    order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']]
  });
  res.status(201).json(created);
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { nombre, celular, addresses } = req.body;
  const client = await Client.findByPk(id);
  if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
  if (celular && !validateBoliviaPhone(celular)) return res.status(400).json({ message: 'Celular no válido' });
  
  await client.update({ nombre: nombre || client.nombre, celular: celular || client.celular });
  
  if (Array.isArray(addresses)) {
    if (addresses.length < 2) return res.status(400).json({ message: 'Se requieren al menos 2 direcciones (origen y destino)' });
    for (const addr of addresses) {
      if (!addr.calle || addr.calle.trim() === '') {
        return res.status(400).json({ message: 'Todas las direcciones deben tener una calle válida' });
      }
    }
    
    await Address.destroy({ where: { clientId: client.id } });
    for (const addr of addresses.slice(0, 5)) {
      await Address.create({ clientId: client.id, calle: addr.calle.trim(), numero: addr.numero?.trim() || null, ciudad: addr.ciudad?.trim() || null });
    }
  }
  
  await recordAudit('Actualización de cliente', 'Client', client.id, `Cliente ${client.nombre} actualizado`);
  const updated = await Client.findByPk(client.id, {
    include: [{ model: Address, as: 'addresses' }],
    order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']]
  });
  res.json(updated);
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findByPk(id);
  if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
  await client.destroy();
  await recordAudit('Eliminación de cliente', 'Client', id, `Cliente ${client.nombre} eliminado`);
  res.json({ message: 'Cliente eliminado' });
};

module.exports = { listClients, createClient, updateClient, deleteClient };
