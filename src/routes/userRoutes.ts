import express from 'express';
import userController from '../controllers/userController'

const router = express.Router()


router.post('/register', userController.register)
router.post('/login', userController.login)



// get requests formatted like 
// router.get('/endpoint', userAuth, endpointController.func)


export default router