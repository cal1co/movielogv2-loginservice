import express from 'express';
import userController from '../controllers/userController'

const router = express.Router()


router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/getuser/:username', userController.getUser)


// get requests formatted like 
// router.get('/endpoint', userAuth, endpointController.func)


export default router