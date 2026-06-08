const express = require('express');
const router = express.Router();
const tripController = require('../controllers/controladorViajes');

router.get('/', tripController.listTrips);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
