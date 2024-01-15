import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user-controllers';
import {
	getCurrentUserSavedArticlesController,
	getAllArticlesController,
	createArticleController,
	saveArticleController,
	unsaveArticleController,
	deleteArticleController,
} from '../controllers/article-controllers';
import {
	createArticleValidator,
	deleteArticleValidator,
	saveArticleValidator,
	unsaveArticleValidator,
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

router.get('/saved-articles', getCurrentUserSavedArticlesController);
router.post(
	'/saved-articles/:articleId',
	saveArticleValidator,
	saveArticleController,
);
router.delete(
	'/saved-articles/:articleId',
	unsaveArticleValidator,
	unsaveArticleController,
);

export default router;
