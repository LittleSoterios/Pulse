const express = require('express');
const router = express.Router();
const PostCtrl = require('../../controllers/api/posts');
const multer = require('multer');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const upload = multer({ dest: 'uploads/' }); // save files in 'uploads' directory temporarily

// all routes start from '/post
router.post('/create', ensureLoggedIn, upload.single('image'), PostCtrl.create);

router.get('/index', ensureLoggedIn, PostCtrl.index)

module.exports = router;