const express = require('express');
const { 
    create, 
    getRecentStacksPreview, 
    getAllByAuthor, 
    getById, 
    update, 
    deleter, 
    addResource, 
    removeResource,
    getResourceIds
} = require('../controllers/stack.js');
const { getUser } = require('../middlewares/auth.js');

const router = express.Router();

router.use(getUser);

router.post('/create', create);
router.get('/getRecentStacksPreview/:page/:page_size', getRecentStacksPreview);
router.get('/getAllByAuthor/:user_Id', getAllByAuthor);
router.get('/getById/:stack_Id', getById);
router.put('/:stack_Id', update);
router.delete('/delete/:stack_Id', deleter);
router.post('/addResource/:stack_Id/:resource_Id', addResource);
router.delete('/removeResource/:stack_Id/:resource_Id', removeResource);
router.get('/getResourceIds/:stack_Id', getResourceIds);

module.exports = router;