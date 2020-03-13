const express = require('express');
const router = express.Router();

/* API routes */
router.use('/categorie', require('./api/categorieRoutes'));
router.use('/beer', require('./api/beerRoutes'));

router.use('/test', require('./api/testRoutes'));


module.exports = router;