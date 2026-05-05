const express = require('express');
const router = express.Router();

// GET /api/vehicles - Liste des véhicules
router.get('/', (req, res) => {
  const simulationService = req.app.locals.simulationService;
  const vehicles = simulationService.getVehicles();
  res.json({ 
    success: true,
    vehicles,
    count: vehicles.length
  });
});

// POST /api/vehicles - Créer un véhicule
router.post('/', (req, res) => {
  const simulationService = req.app.locals.simulationService;
  const vehicle = simulationService.createVehicle(req.body);
  res.status(201).json({ 
    success: true,
    vehicle,
    message: 'Véhicule créé avec succès'
  });
});

// GET /api/vehicles/:id - Détails d'un véhicule
router.get('/:id', (req, res) => {
  const simulationService = req.app.locals.simulationService;
  const vehicle = simulationService.getVehicles().find(v => v.id == req.params.id);
  
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
  }
  
  res.json({ success: true, vehicle });
});

module.exports = router;