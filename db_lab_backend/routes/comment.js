const express = require('express');
const {createForResource, deleteResourceComment, updateTextForResourseComment, getFromDb, getForResource, switchLike, createForStack, getForStack, deleteStackComment, updateTextForStackComment}
       = require('../controllers/comment.js');
const { getUser, isAdmin, isStudent } = require('../middlewares/auth.js');
const router = express.Router();
router.use(isStudent, getUser);

router.post('/createForResource', createForResource);
router.post('/createForStack', createForStack); 
router.delete('/deleteResourceComment/:comment_Id', deleteResourceComment);
router.put('/updateTextForResourceComment/:comment_Id', updateTextForResourseComment);
router.delete('/deleteStackComment/:comment_Id', deleteStackComment);
router.put('/updateTextForStackComment/:comment_Id', updateTextForStackComment);
router.put('/switchLike/:comment_Id', switchLike);
router.get('/getFromDb', getFromDb);
router.get('/getForResource/:resource_Id/:page/:page_size', getForResource);
router.get('/getForStack/:stack_Id/:page/:page_size', getForStack);

module.exports = router;