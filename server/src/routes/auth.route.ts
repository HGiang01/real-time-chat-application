import { Router } from 'express';

import { signupController, loginController, logoutController, getMeController } from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/protectRoute.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/signup', asyncHandler(signupController));
router.post("/login", asyncHandler(loginController));
router.post('/logout', protectRoute, asyncHandler(logoutController));
router.get('/me', protectRoute, asyncHandler(getMeController));

export default router;