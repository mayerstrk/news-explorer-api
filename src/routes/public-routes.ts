import { Router } from 'express';
import {
	createUserController,
	signinController,
	signoutController,
} from '../controllers/user-controllers';

const router = Router();

router.get('/', (_request, response) => {
	response.send('Hello World');
});

router.post('/signup', createUserController);
router.post('/signin', signinController);
router.post('/signout', signoutController);

export default router;
