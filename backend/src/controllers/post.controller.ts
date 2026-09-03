import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../middleware/errorHandler";
import { uploadImageToStorage, deleteImageFromStorage } from "../utils/fileUpload";
import prisma from "../prisma";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;  
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { title, content, published } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is required");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  // multer.array(...) кладёт файлы в req.files. Приводим к массиву:
  // при .single() было бы req.file, при .array() — req.files.
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  // Загружаем все файлы. Копим uploaded отдельно, чтобы было что чистить при ошибке.
  const uploaded: string[] = [];
  try {
    for (const file of files) {
      const url = await uploadImageToStorage(file.path);
      uploaded.push(url);
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        published: published === true || published === "true",
        authorId: userId,
        images: {
          create: uploaded.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        author: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { data: post }, "Post created successfully"));
  } catch (err) {
    // Запись в БД (или загрузка) упала — подчищаем всё, что успели залить,
    // чтобы файлы не остались сиротами без ссылки в БД.
    await Promise.allSettled(uploaded.map((url) => deleteImageFromStorage(url)));
    throw err;
  }
});

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  // Парсим и валидируем параметры. Всё из query приходит строкой.
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const rawLimit = parseInt(req.query.limit as string) || 10;
  // Ограничиваем limit сверху, чтобы клиент не запросил ?limit=100000
  const limit = Math.min(50, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  // Опциональный фильтр: показывать только опубликованные.
  // По умолчанию — только published, черновики скрыты.
  const where = { published: true } as const;

  // Считаем total и достаём страницу одним заходом (параллельно).
  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        author: {
          select: { id: true, name: true, profileImage: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Posts fetched successfully"
    )
  );
});

export const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  
  if(!username) throw new ApiError(404, "User not found");
  
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const rawLimit = parseInt(req.query.limit as string) || 10;
  // Ограничиваем limit сверху, чтобы клиент не запросил ?limit=100000
  const limit = Math.min(50, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  //Сначала проверим существует ли пользователь в базе
  const user = await prisma.user.findUnique({
    where: {name:username.toString().trim()},
    select: {id: true}
  });
   
  if(!user) throw new ApiError(404, "User not found"); 

  // Опциональный фильтр: показывать только опубликованные.
  // По умолчанию — только published, черновики скрыты.
  const where = {published: true, authorId:user.id } as const;

  // Считаем total и достаём страницу одним заходом (параллельно).
  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        author: {
          select: { id: true, name: true, profileImage: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Posts fetched successfully"
    )
  );
})

export const updatePostContent = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user?.id;
  const { postId } = req.params;
  const { content, published } = req.body;

  if(!content || content === "") {
    throw new ApiError(400, "content is required and it cannot be empty")
  }

  console.log(postId);
  console.log(userId)

  if(!userId){
    throw new ApiError(404, "user id not found");
  }

  if(!postId) {
    throw new ApiError(404, "post id is not found")
  }

 const post = await prisma.post.findUnique({
    where: {
      id: postId.toString()
    }
  })

  if(!post){
    throw new ApiError(404, "post not found")
  }
  
  if(post?.authorId !== userId) {
    throw new ApiError(401,"You are not authorize to edit this post")
  }

  post.content = content
  post.published = published

  await prisma.post.update({
    where: { id: postId.toString() },
    data: { content: content, published: published },
  });

  return res.status(200).json(new ApiResponse(200, post, "update has been completed sucessfully"));
})

export const deletePost = asyncHandler(async (req:Request, res:Response) => {
  const { postId } = req.params
  const userId = req.user?.id

  if(!postId){
    throw new ApiError(404, "post is not found")
  }

  if(!userId){
    throw new ApiError(404, "user not found")
  }
  
  const post = await prisma.post.findUnique({
    where: {
      id: postId.toString(),
      authorId: userId
    }
  })

  if(!post){
    throw new ApiError(404, "post is not found")
  }

  if(post?.authorId !== userId) {
    throw new ApiError(401,"You are not authorize to delete this post")
  }

  const deletePost = await prisma.post.delete({
    where: {
      id: postId.toString()
    }
  })

  if(!deletePost){
    throw new ApiError(401,"You are not authorize to delete this post")
  }

  return res.status(203).json(new ApiResponse(203, null, "post has been deleted"))

})