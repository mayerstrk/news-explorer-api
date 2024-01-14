import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user-controllers';
import {
	getCurrentUserSavedArticlesController,
	getAllArticlesController,
	createArticleController,
	saveArticleController,
	unsaveArticleController,
} from '../controllers/article-controllers';
import {
	createArticleValidator,
	saveArticleValidator,
	unsaveArticleValidator,
} from '../validators/controller-validators';
const router = Router();

router.get('/users/me', getCurrentUserController);

router.get('/articles', getAllArticlesController);
router.post('/articles', createArticleValidator, createArticleController);

router.get('/users/me/articles', getCurrentUserSavedArticlesController);
router.post(
	'/users/me/articles/:articleId',
	saveArticleValidator,
	saveArticleController,
);
router.delete(
	'/users/me/articles/:articleId',
	unsaveArticleValidator,
	unsaveArticleController,
);

export default router;
