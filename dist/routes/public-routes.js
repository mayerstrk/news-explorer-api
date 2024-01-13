"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user-controllers");
const router = (0, express_1.Router)();
router.post('/signup', user_controllers_1.createUserController);
router.post('/signin', user_controllers_1.signinController);
router.post('/signout', user_controllers_1.signoutController);
exports.default = router;
//# sourceMappingURL=public-routes.js.map