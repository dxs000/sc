import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";

export const togglePostLike = asyncHandler(async (req: Request, res: Response) => {
 const userId = req.user?.id;
 const { postId } = req. params;

 if(!userId) {
    throw new ApiError(404, "user not found");
 }

 if(!postId) {
    throw new ApiError(404, "post not found");
 }

 const post = await prisma.post.findUnique({
    where:{
        id: postId.toString()
    }
 })

 if(!post) {
    throw new ApiError(404, "post not found");
 }

 const isLiked = await prisma.like.findMany({
   where: {
      postId: postId.toString(),
      likeById: userId.toString()
   },   
 })

 if(!isLiked) {
   await prisma.like.create({
      data: {
         postId: postId.toString(),
         likeById: userId.toString()
      },
   })
   return res.status(201).json(new ApiResponse(201, post, "you like the post"));
 }
 else {
   await prisma.like.deleteMany({
      where: {
         postId: postId.toString(),
         likeById: userId.toString()
      },
   })
   return res.status(200).json(new ApiResponse(200, null, "you like has been deleted"));
 }
});   