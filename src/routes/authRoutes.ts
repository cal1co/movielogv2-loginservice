import express from 'express';
import userController from '../controllers/userController'
import followController from '../controllers/followController'
import searchController from '../controllers/searchController'
import { rateLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';
import s3Controller from '../controllers/s3Controllers'
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.post('/register', rateLimiter, userController.register)
router.post('/login', rateLimiter, userController.login)

router.get('/getuser/:username', rateLimiter, userController.getUser)

router.post('/follow/:followingId', rateLimiter, authMiddleware, followController.follow)
router.post('/unfollow/:followingId', rateLimiter, authMiddleware, followController.unfollow)

router.get('/search/:usernameQuery', rateLimiter, authMiddleware, searchController.searchUser)

router.get('/s3test', rateLimiter, s3Controller.getImage)
router.post('/s3test', rateLimiter, upload.single('content'), s3Controller.uploadImage)


export default router