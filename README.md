# Plateforme de Transport Touristique

Une plateforme web complète pour la réservation de services de transport touristique (transferts aéroport, excursions, circuits privés, navettes).

## 🚀 Fonctionnalités

### Frontend (Clients)
- ✅ Page d'accueil avec moteur de recherche
- ✅ Catalogue d'offres avec filtres avancés
- ✅ Processus de réservation en 4 étapes
- ✅ Paiement en ligne sécurisé (Stripe, PayPal)
- ✅ Espace client personnalisé
- ✅ Système d'avis et notes
- ✅ Multilingue (FR/EN/AR/ES)
- ✅ Responsive design

### Backend (Opérateurs/Admin)
- ✅ Gestion des offres et circuits
- ✅ Gestion de la flotte de véhicules
- ✅ Gestion des chauffeurs
- ✅ Planning et répartition automatique
- ✅ Système de tarification flexible
- ✅ Dashboard avec KPI
- ✅ Facturation et rapports

### Interface Chauffeur
- ✅ Liste des missions
- ✅ Navigation GPS intégrée
- ✅ Communication client-chauffeur
- ✅ Suivi en temps réel

## 🛠 Technologies

### Frontend
- **Next.js 14** - Framework React avec SSR
- **Tailwind CSS** - Framework CSS utilitaire
- **React Hook Form** - Gestion des formulaires
- **Axios** - Client HTTP
- **Leaflet** - Cartes interactives

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Sequelize** - ORM
- **JWT** - Authentification
- **Stripe** - Paiements en ligne
- **Redis** - Cache et sessions

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Redis (optionnel)

### 1. Cloner le projet
```bash
git clone <repository-url>
cd transport-platform
```

### 2. Installation des dépendances
```bash
# Dépendances principales
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configuration de la base de données
```bash
# Créer la base de données
createdb transport_platform

# Exécuter le schéma
psql -d transport_platform -f database/schema.sql
```

### 4. Configuration de l'environnement
```bash
# Backend
cp backend/.env.example backend/.env
# Modifier les variables d'environnement

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Modifier les variables d'environnement
```

### 5. Démarrage en développement
```bash
# Démarrer les deux services
npm run dev

# Ou séparément
npm run dev:backend  # Port 5000
npm run dev:frontend # Port 3000
```

## 🏗 Architecture

```
transport-platform/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs
│   │   ├── models/         # Modèles Sequelize
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middleware personnalisé
│   │   ├── services/       # Logique métier
│   │   └── utils/          # Utilitaires
│   └── package.json
├── frontend/               # Application Next.js
│   ├── pages/             # Pages et routes
│   ├── components/        # Composants React
│   ├── styles/           # Styles CSS
│   ├── utils/            # Utilitaires frontend
│   └── package.json
├── database/              # Scripts SQL
│   └── schema.sql
└── docs/                 # Documentation
```

## 🔐 Sécurité

- **Authentification JWT** avec refresh tokens
- **Validation des données** avec express-validator
- **Rate limiting** pour prévenir les abus
- **Helmet.js** pour les headers de sécurité
- **CORS** configuré
- **Chiffrement des mots de passe** avec bcrypt
- **Conformité PCI DSS** pour les paiements

## 📊 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings/my-bookings` - Mes réservations
- `PATCH /api/bookings/:id/cancel` - Annuler une réservation

### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `POST /api/vehicles` - Ajouter un véhicule (admin)
- `PUT /api/vehicles/:id` - Modifier un véhicule

## 🚀 Déploiement

### Production
```bash
# Build
npm run build

# Démarrage
npm start
```

### Docker (optionnel)
```bash
docker-compose up -d
```

## 📈 Monitoring

- **Logs** avec Winston
- **Métriques** avec Prometheus
- **Alertes** avec Sentry
- **Uptime** monitoring

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email: support@transport-platform.com
- Documentation: [docs.transport-platform.com](https://docs.transport-platform.com)