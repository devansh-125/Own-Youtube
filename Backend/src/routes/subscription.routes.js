import { Router } from 'express';

import {
    getSubscribedChannels,
    toggleSubscription,
    getSubscriptionStatus
} from '../controllers/subscription.controller.js';

import { verifyAuth } from '../middlewares/verifyAuth.middleware.js';

const router = Router();

router.use(verifyAuth); 

router.route("/c/:channelId").post(toggleSubscription);
router.route("/u/:subscriberId").get(getSubscribedChannels);
router.route("/status/:channelId").get(getSubscriptionStatus);

export default router;

