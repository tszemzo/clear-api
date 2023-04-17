const router = require('express').Router();

router.use('/clients', require('./clients'));
router.use('/members', require('./members'));

module.exports = router;
