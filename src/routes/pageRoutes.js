const express = require('express');
const { getTemplates, getTemplateBySlug } = require('../controllers/templateController');
const { listResultsBySession, getResultForPage, getSessionId } = require('../controllers/resultController');
const { formatDate } = require('../utils/renderHelper');

const router = express.Router();

router.use((req, res, next) => {
  getSessionId(req);
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const templates = await getTemplates({ activeOnly: true });
    return res.render('pages/home', {
      title: 'Galeri Template Foto Estetik',
      templates,
      today: formatDate()
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/templates', async (req, res, next) => {
  try {
    const templates = await getTemplates({ activeOnly: true });
    const categories = [...new Set(templates.map((item) => item.category))];
    return res.render('pages/templates', {
      title: 'Pilih Template',
      templates,
      categories
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/templates/:slug', async (req, res, next) => {
  try {
    const template = await getTemplateBySlug(req.params.slug, { activeOnly: true });
    if (!template) {
      return res.status(404).render('pages/error', {
        title: 'Template Tidak Ditemukan',
        message: 'Template yang kamu pilih tidak tersedia.'
      });
    }

    return res.render('pages/template-detail', {
      title: template.name,
      template
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/create/:slug', async (req, res, next) => {
  try {
    const template = await getTemplateBySlug(req.params.slug, { activeOnly: true });
    if (!template) {
      return res.status(404).render('pages/error', {
        title: 'Template Tidak Ditemukan',
        message: 'Template yang kamu pilih tidak tersedia.'
      });
    }

    return res.render('pages/create', {
      title: `Ambil Foto - ${template.name}`,
      template,
      today: formatDate()
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/editor/:id', async (req, res, next) => {
  try {
    const result = await getResultForPage(req);
    if (!result) {
      return res.status(404).render('pages/error', {
        title: 'Hasil Tidak Ditemukan',
        message: 'Hasil foto tidak tersedia atau sudah dihapus otomatis.'
      });
    }

    const template = await getTemplateBySlug(result.templateSlug, { activeOnly: false });
    if (!template) {
      return res.status(404).render('pages/error', {
        title: 'Template Tidak Ditemukan',
        message: 'Template untuk hasil ini tidak tersedia.'
      });
    }

    return res.render('pages/editor', {
      title: `Editor - ${result.templateName || template.name}`,
      template,
      result,
      today: formatDate()
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const results = await listResultsBySession(req);
    return res.render('pages/history', {
      title: 'Riwayat Hasil',
      results
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
