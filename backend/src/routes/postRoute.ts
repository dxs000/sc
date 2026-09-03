import { verifyJWT } from './../middleware/auth.middleware';
import express from "express"
import { upload } from "../middleware/multer.middleware";
import { createPost, getAllPosts, getUserPosts, updatePostContent, deletePost } from '../controllers/post.controller';

const router = express.Router();

router.post("/createPost", verifyJWT,  upload.any(), createPost);
router.get("/all-post",verifyJWT,getAllPosts);
router.get("/get-user-posts/:username", verifyJWT, getUserPosts);
router.patch("/update-post/:postId", verifyJWT, updatePostContent);
router.delete("/post-delete/:postId", verifyJWT, deletePost)


export default router