import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user-controllers';
import {
	getCurrentUserSavedArticlesController,
	getAllArticlesController,
	createArticleController,
	saveArticleController,
	unsaveArticleController,
} from '../controllers/article-controllers';
const router = Router();

router.get('/users/me', getCurrentUserController);

router.get('/articles', getAllArticlesController);
router.post('/articles', createArticleController);

router.get('/users/me/articles', getCurrentUserSavedArticlesController);
router.post('/users/me/articles/:articleId', saveArticleController);
router.delete('users/me/articles/:articleId', unsaveArticleController);

export default router;
