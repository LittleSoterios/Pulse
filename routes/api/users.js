const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');
const user = require('../../models/user');
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // save files in 'uploads' directory temporarily

// All paths start with '/api/users'

// POST /api/users (create a user - sign up)
router.post('/', usersCtrl.create);
// POST /api/users/login
router.post('/login', usersCtrl.login);

router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken)

router.get('/search', ensureLoggedIn, usersCtrl.search)

router.post('/follow/:id', ensureLoggedIn, usersCtrl.follow)

router.post('/unfollow/:id', ensureLoggedIn, usersCtrl.unfollow)

router.get('/get_history', ensureLoggedIn, usersCtrl.getHistory)

router.post('/change_avatar', ensureLoggedIn, upload.single('image'), usersCtrl.changeAvatar)

router.get('/get_notifications', ensureLoggedIn, usersCtrl.getNotifications)



module.exports = router;