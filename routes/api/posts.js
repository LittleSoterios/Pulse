const express = require('express');
const router = express.Router();
const PostCtrl = require('../../controllers/api/posts');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // save files in 'uploads' directory temporarily

// all routes start from '/post
router.post('/create', upload.single('image'), PostCtrl.create);

module.exports = router;