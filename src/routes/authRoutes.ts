import express from 'express';
import userController from '../controllers/userController'
import followController from '../controllers/followController'
import searchController from '../controllers/searchController'
import { rateLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/getuser/:username', rateLimiter, userController.getUser)

router.post('/follow/:followingId', rateLimiter, authMiddleware, followController.follow)
router.post('/unfollow/:followingId', rateLimiter, authMiddleware, followController.unfollow)

router.get('/search/:usernameQuery', rateLimiter, authMiddleware, searchController.searchUser)


export default router