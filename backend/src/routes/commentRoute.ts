import { createComment, getCommentByPost, deleteComment } from '../controllers/comment.controller';
import { verifyJWT } from './../middleware/auth.middleware';
import express from "express"

const router = express.Router();

router.post('/create-comment/:postId', verifyJWT, createComment);
router.get('/all-comments/:postId', verifyJWT, getCommentByPost);
router.delete('/delete-comment/post/:postId/comment/:commentId', verifyJWT, deleteComment);

export default router