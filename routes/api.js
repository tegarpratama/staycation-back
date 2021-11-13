const router = require('express').Router();
const apiController = require('../controllers/apiController');

// Define middleware
// const { upload, uploadMultiple } = require('../middlewares/multer');
// const auth = require('../middlewares/auth');

router.get('/landing-page', apiController.landingPage);

module.exports = router;