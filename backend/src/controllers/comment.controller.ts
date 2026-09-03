import { updatePostContent } from './post.controller';
import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../middleware/errorHandler";  
import prisma from "../prisma";

export const createComment = asyncHandler(async (req: Request, res: Response) => { 
    const userId = req.user?.id;
    const { postId } = req.params;
    const { comment } = req.body;

    if(!userId){
        throw new ApiError(404, "user not found");
    }

    if(!postId){
        throw new ApiError(404, "Post not found");
    }

    if(!comment || comment === "") {
        throw new ApiError(404, "comment is required")
    }

    const post = await prisma.post.findUnique({
        where:{
            id: postId.toString()
        }
    })

    if(!post) {
        throw new ApiError(404, "Post not found");
    }

    const newComment = await prisma.comment.create({
        data:{
            content: comment,
            postId: postId.toString(),
            authorId: userId.toString()
        }
    })

    return res.status(201).json(new ApiResponse(201, newComment, "comment was created"))



});

export const getCommentByPost = asyncHandler(async (req: Request, res: Response) => { 
    const { postId } = req.params

    if(!postId) {
        throw new ApiError(404, "post not found")
    }

    const comments = await prisma.comment.findMany({
        where:{
            postId: postId.toString()
        }, 
        select: {id:true, content:true, postId:true,  authorId:true, author: {
            select: {
                name: true,
                }
            }
        }
    })
    
    res.status(200).json(new ApiResponse(200, comments, "comment has been fetched"))

});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const {postId, commentId} = req.params;
    
    if(!userId){
        throw new ApiError(404, "user id not found");
    }

    if(!commentId){
        throw new ApiError(404, "comment not found");
    }

    const post = await prisma.post.findUnique({
        where:{
            id:postId?.toString()
        }
    });

    if(!post){
        throw new ApiError(404, "post not found");
    }

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId.toString(),
            postId: post.id
        }
    })

    if(!comment){
        throw new ApiError(404, "comment not found");
    }
    
    const deletedComment = await prisma.comment.delete({
        where:{
            id: commentId.toString(),
            authorId: userId,
            postId: post.id
        }
    })

    if(!deleteComment) {
        throw new ApiError(401, "You have not permissions");
    }

    res.status(200).json(new ApiResponse(200, null, "comment has been deleted"));

})