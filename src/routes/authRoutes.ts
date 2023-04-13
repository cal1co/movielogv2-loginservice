import express from 'express';
import userController from '../controllers/userController'
import followController from '../controllers/followController'
import { rateLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/getuser/:username', userController.getUser)

router.post('/follow/:followingId', authMiddleware, followController.follow)
router.post('/unfollow/:followingId', authMiddleware, followController.unfollow)

export default router