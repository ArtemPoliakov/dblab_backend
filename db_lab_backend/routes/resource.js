const express = require('express');
const {create, deleter, update, getFromDb} = require('../controllers/resource.js');
const { getUser } = require('../middlewares/auth.js');
const router = express.Router();
router.use(getUser);

router.post('/create', create);
router.delete('/delete/:resource_Id', deleter);
router.put('/:resource_Id', update);
router.get('/getFromDb', getFromDb);

module.exports = router;