const express = require('express');
const {create, deleter, update, getFromDb, getRecentResourcesPreview, getById, getAllByAuthor, search} = require('../controllers/resource.js');
const { getUser } = require('../middlewares/auth.js');
const router = express.Router();
router.use(getUser);

router.post('/create', create);
router.delete('/delete/:resource_Id', deleter);
router.put('/:resource_Id', update);
router.get('/getFromDb', getFromDb);
router.get('/getRecentResourcesPreview/:page/:page_size', getRecentResourcesPreview);
router.get('/getById/:resource_Id', getById);
router.get('/getAllByAuthor/:user_Id', getAllByAuthor);
router.get('/search', search);
module.exports = router;