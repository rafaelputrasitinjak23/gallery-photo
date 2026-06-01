const express = require('express');
const authAdmin = require('../middlewares/authAdmin');
const { adminLimiter } = require('../middlewares/rateLimiter');
const {
  loginPage,
  loginAction,
  logout,
  dashboard,
  templateManager
} = require('../controllers/adminController');
const {
  adminCreateTemplate,
  adminUpdateTemplate,
  adminDeleteTemplate,
  adminPatchTemplateStatus
} = require('../controllers/templateController');

const router = express.Router();

router.get('/login', adminLimiter, loginPage);
router.post('/login', adminLimiter, loginAction);
router.post('/logout', authAdmin, logout);
router.get('/', authAdmin, dashboard);
router.get('/templates', authAdmin, templateManager);
router.post('/templates', authAdmin, adminCreateTemplate);
router.put('/templates/:id', authAdmin, adminUpdateTemplate);
router.delete('/templates/:id', authAdmin, adminDeleteTemplate);
router.patch('/templates/:id/status', authAdmin, adminPatchTemplateStatus);

module.exports = router;
