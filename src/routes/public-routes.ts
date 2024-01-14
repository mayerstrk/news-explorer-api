import { Router } from 'express';
import {
	createUserController,
	signinController,
	signoutController,
} from '../controllers/user-controllers';
import {
	createUserValidator,
	signInValidator,
} from '../validators/controller-validators';

const router = Router();

router.post('/signup', createUserValidator, createUserController);
router.post('/signin', signInValidator, signinController);
router.post('/signout', signoutController);

export default router;
