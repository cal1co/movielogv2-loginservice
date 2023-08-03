import express from 'express';
import userController from '../controllers/userController'
import userPageController from '../controllers/userPageController'
import followController from '../controllers/followController'
import searchController from '../controllers/searchController'
import { rateLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';
import { activityTrackerMiddleware } from '../middleware/activityTrackerMiddleware';
import s3Controller from '../controllers/s3Controllers'
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.post('/register', rateLimiter, userController.register)
router.post('/login', rateLimiter, userController.login)
router.get('/user/verify', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.getUserData)

router.get('/getuser/:username', rateLimiter, userController.getUser)
router.get('/user/:id', rateLimiter, authMiddleware, activityTrackerMiddleware, userPageController.getUser)

router.get('/userdata', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.getUserData)

router.post('/user/update/bio', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.updateBio)
router.post('/user/update/displayname', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.updateDisplayName)
router.post('/user/update/username', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.updateUsername)
router.post('/user/update/password', rateLimiter, authMiddleware, activityTrackerMiddleware, userController.updatePassword)

router.post('/follow/:followingId', rateLimiter, authMiddleware, activityTrackerMiddleware, followController.follow)
router.post('/unfollow/:followingId', rateLimiter, authMiddleware, activityTrackerMiddleware, followController.unfollow)

router.get('/search/user/:usernameQuery', rateLimiter, authMiddleware, activityTrackerMiddleware, searchController.searchUser)
router.get('/search/post/:postContentQuery', rateLimiter, authMiddleware, activityTrackerMiddleware, searchController.searchPost)

router.get('/s3image/:image', rateLimiter, s3Controller.getImage)
router.post('/s3image/fetch/images', rateLimiter, s3Controller.getImagesById)
router.post('/s3image', rateLimiter, upload.single('content'), s3Controller.uploadImage)
router.post('/s3image/feed', rateLimiter, s3Controller.handleMultiple)
router.post('/user/s3image/upload', rateLimiter, authMiddleware, activityTrackerMiddleware, upload.single('content'), s3Controller.updateProfileImage)
router.post('/s3video', rateLimiter, upload.single('content'), s3Controller.uploadVideo)
router.post('/s3image/post/media', rateLimiter, upload.array('content'), s3Controller.uploadPostMedia)
router.post('/s3image/post/images', rateLimiter, s3Controller.getPostImages)

export default router