import { verifyJWT } from './../middleware/auth.middleware';
import express from "express"
import { togglePostLike } from "../controllers/like.comtroller";

const router = express.Router();

router.post('/like-post/:postId', verifyJWT, togglePostLike);

export default router