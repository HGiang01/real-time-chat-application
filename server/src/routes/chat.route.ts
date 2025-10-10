import { Router } from 'express';

import { protectRoute } from '../middlewares/protectRoute.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getConversations, getMessages } from '../controllers/chat.controller.js';

const router = Router();

router.get("/conversations", protectRoute, asyncHandler(getConversations));
router.get("/:id", protectRoute, asyncHandler(getMessages));


export default router;