const { Route } = require('../models');
const { Op } = require('sequelize');

// Données de simulation
const mockRoutes = [
  {
    id: '1',
    name: 'Aéroport Mohammed V - Centre-ville Casablanca',
    departure_location: 'Aéroport Mohammed V',
    arrival_location: 'Centre-ville Casablanca',
    distance_km: 35,
    estimated_duration: 45,
    base_price: 25.00,
    price_per_passenger: 5.00,
    vehicle_type: 'sedan',
    service_type: 'transfer',
    is_active: true
  },
  {
    id: '2',
    name: 'Casablanca - Rabat',
    departure_location: 'Casablanca',
    arrival_location: 'Rabat',
    distance_km: 90,
    estimated_duration: 90,
    base_price: 40.00,
    price_per_passenger: 7.50,
    vehicle_type: 'suv',
    service_type: 'transfer',
    is_active: true
  },
  {
    id: '3',
    name: 'Circuit Marrakech - Vallée de l\'Ourika',
    departure_location: 'Marrakech',
    arrival_location: 'Vallée de l\'Ourika',
    distance_km: 65,
    estimated_duration: 480,
    base_price: 80.00,
    price_per_passenger: 10.00,
    vehicle_type: 'van',
    service_type: 'excursion',
    is_active: true
  }
];

// Obtenir tous les trajets actifs
exports.getRoutes = async (req, res) => {
  try {
    const { service_type, vehicle_type } = req.query;
    
    // Essayer d'utiliser la base de données d'abord
    try {
      const where = { is_active: true };
      if (service_type) where.service_type = service_type;
      if (vehicle_type) where.vehicle_type = vehicle_type;

      const routes = await Route.findAll({
        where,
        order: [['name', 'ASC']]
      });

      res.json(routes);
    } catch (dbError) {
      // Si la base de données n'est pas disponible, utiliser les données de simulation
      let filteredRoutes = mockRoutes.filter(route => route.is_active);
      
      if (service_type) {
        filteredRoutes = filteredRoutes.filter(route => route.service_type === service_type);
      }
      if (vehicle_type) {
        filteredRoutes = filteredRoutes.filter(route => route.vehicle_type === vehicle_type);
      }
      
      res.json(filteredRoutes);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau trajet (admin)
exports.createRoute = async (req, res) => {
  try {
    try {
      const route = await Route.create(req.body);
      res.status(201).json(route);
    } catch (dbError) {
      // Mode simulation
      const newRoute = {
        id: Date.now().toString(),
        ...req.body,
        is_active: true
      };
      mockRoutes.push(newRoute);
      res.status(201).json(newRoute);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un trajet (admin)
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      const [updated] = await Route.update(req.body, {
        where: { id }
      });

      if (!updated) {
        return res.status(404).json({ error: 'Trajet non trouvé' });
      }

      const route = await Route.findByPk(id);
      res.json(route);
    } catch (dbError) {
      // Mode simulation
      const routeIndex = mockRoutes.findIndex(r => r.id === id);
      if (routeIndex === -1) {
        return res.status(404).json({ error: 'Trajet non trouvé' });
      }
      
      mockRoutes[routeIndex] = { ...mockRoutes[routeIndex], ...req.body };
      res.json(mockRoutes[routeIndex]);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un trajet (admin)
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      const deleted = await Route.destroy({
        where: { id }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Trajet non trouvé' });
      }

      res.status(204).send();
    } catch (dbError) {
      // Mode simulation
      const routeIndex = mockRoutes.findIndex(r => r.id === id);
      if (routeIndex === -1) {
        return res.status(404).json({ error: 'Trajet non trouvé' });
      }
      
      mockRoutes.splice(routeIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculer le prix d'un trajet
exports.calculatePrice = async (req, res) => {
  try {
    const { routeId, passengers = 1 } = req.body;
    
    let route;
    
    // Essayer d'utiliser la base de données d'abord
    try {
      route = await Route.findByPk(routeId);
    } catch (dbError) {
      // Si la base de données n'est pas disponible, utiliser les données de simulation
      route = mockRoutes.find(r => r.id === routeId);
    }
    
    if (!route || !route.is_active) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }

    const totalPrice = parseFloat(route.base_price) + 
                      (parseFloat(route.price_per_passenger) * (passengers - 1));

    res.json({
      route_id: routeId,
      base_price: route.base_price,
      price_per_passenger: route.price_per_passenger,
      passengers,
      total_price: totalPrice.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};