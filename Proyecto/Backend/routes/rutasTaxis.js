const express = require('express');
const router = express.Router();
const taxiController = require('../controllers/controladorTaxis');

router.get('/', taxiController.listTaxis);
router.post('/', taxiController.createTaxi);
router.put('/:id', taxiController.updateTaxi);
router.post('/:id/toggle', taxiController.toggleDisponibilidad);
router.delete('/:id', taxiController.deleteTaxi);

module.exports = router;
