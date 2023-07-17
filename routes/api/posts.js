const express = require('express');
const router = express.Router();
const PostCtrl = require('../../controllers/api/posts');
const multer = require('multer');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const upload = multer({ dest: 'uploads/' }); // save files in 'uploads' directory temporarily

// all routes start from '/post
router.post('/create', ensureLoggedIn, upload.single('image'), PostCtrl.create);

router.get('/index', ensureLoggedIn, PostCtrl.index)
router.get('/index_own', ensureLoggedIn, PostCtrl.index_own)
router.post('/like/:id', ensureLoggedIn, PostCtrl.like)
router.post('/dislike/:id', ensureLoggedIn, PostCtrl.dislike)
router.get('/index_likes', ensureLoggedIn, PostCtrl.index_likes)

module.exports = router;