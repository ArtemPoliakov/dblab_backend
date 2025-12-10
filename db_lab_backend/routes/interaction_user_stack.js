const express = require('express');
const {
    create, 
    deleter, 
    update, 
    getFromDb, 
    create_or_update, 
    get_all_for_user
} = require('../controllers/interaction_user_stack.js');
const { getUser, isAdmin, isStudent } = require('../middlewares/auth.js');

const router = express.Router();

router.use(isStudent, getUser);

router.post('/create', create);
router.delete('/delete', isAdmin, deleter);
router.get('/getAllForUser/:user_Id', isAdmin, get_all_for_user);
router.put('/update', update);
router.post('/createOrUpdate', create_or_update);
router.get('/getFromDb', getFromDb);

module.exports = router;