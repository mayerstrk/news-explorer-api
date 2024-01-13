import { Router } from 'express';
import {
	createUserController,
	signinController,
	signoutController,
} from '../controllers/user-controllers';

const router = Router();

router.post('/signup', createUserController);
router.post('/signin', signinController);
router.post('/signout', signoutController);

export default router;
