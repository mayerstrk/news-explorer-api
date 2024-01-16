import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user-controllers';
import {
	getAllArticlesController,
	createArticleController,
	deleteArticleController,
} from '../controllers/article-controllers';
import {
	createArticleValidator,
	deleteArticleValidator,
} from '../validators/controller-validators';
const router = Router();

router.get('/users/me', getCurrentUserController);

router.get('/articles', getAllArticlesController);
router.post('/articles', createArticleValidator, createArticleController);
router.delete(
	'/articles/:articleId',
	deleteArticleValidator,
	deleteArticleController,
);

export default router;
