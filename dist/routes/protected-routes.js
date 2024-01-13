"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user-controllers");
const article_controllers_1 = require("../controllers/article-controllers");
const router = (0, express_1.Router)();
router.get('/users/me', user_controllers_1.getCurrentUserController);
router.get('/articles', article_controllers_1.getAllArticlesController);
router.post('/articles', article_controllers_1.createArticleController);
router.get('/users/me/articles', article_controllers_1.getCurrentUserSavedArticlesController);
router.post('/users/me/articles/:articleId', article_controllers_1.saveArticleController);
router.delete('users/me/articles/:articleId', article_controllers_1.unsaveArticleController);
exports.default = router;
//# sourceMappingURL=protected-routes.js.map