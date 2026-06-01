const express = require('express');
const {
  listTemplatesApi,
  singleTemplateApi
} = require('../controllers/templateController');

const router = express.Router();

router.get('/templates', listTemplatesApi);
router.get('/templates/:slug', singleTemplateApi);

module.exports = router;
