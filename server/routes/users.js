import express from 'express';
import { verifyToken } from '../middleware/auth.js';
const router=express.Router();

import {getUser,getUserFriends,addRemoveFriend} from '../controllers/users.js';

/* Read */

router.get('/:id',verifyToken,getUser)
router.get('/:id/friends',verifyToken,getUserFriends)

/* Update */

router.patch('/:id/:friendId',verifyToken,addRemoveFriend)

export default router;