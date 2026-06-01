const express = require('express');
const {
  createResultApi,
  getResultApi,
  updateResultApi,
  deleteResultApi
} = require('../controllers/resultController');

const router = express.Router();

router.post('/results', createResultApi);
router.get('/results/:id', getResultApi);
router.patch('/results/:id', updateResultApi);
router.delete('/results/:id', deleteResultApi);

module.exports = router;
