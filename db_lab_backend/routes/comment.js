const express = require('express');
const {createForResource, deleteResourceComment, updateText, getFromDb, getForResource, switchLike}
       = require('../controllers/comment.js');
const { getUser, isAdmin, isStudent } = require('../middlewares/auth.js');
const router = express.Router();
router.use(isStudent, getUser);

router.post('/createForResource', createForResource);
router.delete('/deleteResourceComment/:comment_Id', deleteResourceComment);
router.put('/updateText/:comment_Id', updateText);
router.put('/switchLike/:comment_Id', switchLike);
router.get('/getFromDb', getFromDb);
router.get('/getForResource/:resource_Id', getForResource);

module.exports = router;