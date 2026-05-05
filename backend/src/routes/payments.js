const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Paiement traité' });
});

module.exports = router;