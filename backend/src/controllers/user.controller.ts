import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadImageToStorage, deleteImageFromStorage } from "../utils/fileUpload";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokens";
import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";


const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  profileImage: true,
  bio:true,
  createdAt: true,
} as const;

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (!email || email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!email.includes("@")) {
    throw new ApiError(400, "Email address is wrong");
  }
  if (!password || password === "") {
    throw new ApiError(400, "Password is required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password should be same");
  }

  // Ищем только по реально переданным полям, чтобы { name: undefined }
  // не превратился в пустой фильтр, матчащий любого пользователя.
  const conditions: Array<{ email: string } | { name: string }> = [];
  if (email) conditions.push({ email });
  if (username) conditions.push({ name: username });

  const existingUser = await prisma.user.findFirst({
    where: { OR: conditions },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Загружаем картинку только после успешной валидации,
  // чтобы не заливать файл при заведомо провальном запросе.
  let profileImageUrl = "";
  if (req.file?.path) {
    profileImageUrl = await uploadImageToStorage(req.file.path);
  }

  const createdUser = await prisma.user.create({
    data: {
      name: username,
      email,
      password,
      profileImage: profileImageUrl,
    },
    select: publicUserSelect,
  });

  const refreshToken = await generateRefreshToken(createdUser);
  const accessToken = await generateAccessToken(createdUser);

  const user = await prisma.user.update({
    where: { id: createdUser.id },
    data: { refreshToken },
    select: publicUserSelect,
  });

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { success: true, user, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username & Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const conditions: Array<{ email: string } | { name: string }> = [];
  if (email) conditions.push({ email });
  if (username) conditions.push({ name: username });

  // Без select — объект полный, поэтому computed-поле isPasswordCorrect доступно.
  const existingUser = await prisma.user.findFirst({
    where: { OR: conditions },
  });

  // Одинаковый ответ на "нет пользователя" и "неверный пароль",
  // чтобы не подсказывать атакующему, какие аккаунты существуют.
  if (!existingUser || !(await existingUser.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const refreshToken = await generateRefreshToken(existingUser);
  const accessToken = await generateAccessToken(existingUser);

  const loggedInUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: { refreshToken },
    select: publicUserSelect,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { success: true, user: loggedInUser, accessToken, refreshToken },
        "User login successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const loggedOutUser = await prisma.user.update({
    where: { id: userId },
    data: { refreshToken:"" },
    select: publicUserSelect,
  });

  return res
    .status(200)
    .clearCookie("accessToken",cookieOptions)
    .clearCookie("refreshToken",cookieOptions)
    .json(
      new ApiResponse(
        200,
        { success: true }, "User logged out"        
      )
    );
});

export const getCurrectUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json(
     new ApiResponse(
      200,
      {success:true, data:user}, "User fetched successfully"
     )    
  )
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ??
    req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  let payload;
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    // и просроченный, и битый токен → 401
    throw new ApiError(401, "Unauthorized: invalid or expired token");
  }
  
  const userId = payload.id
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { ...publicUserSelect, refreshToken: true }
  })
  
  if(!user){
    throw new ApiError(401, "Unauthorized: invalid or expired token");
  }

  if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(401, "Unauthorized: invalid or expired token");
  }

  const newRefreshToken = await generateRefreshToken(user);
  const newAccessToken = await generateAccessToken(user);

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: newRefreshToken },
    
  });

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { success: true, accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Tokens refreshed successfully"
      )
    );
});

export const changeCurrectPassword = asyncHandler(async (req: Request, res: Response) => {
  const{oldPassword, newPassword, confirmPassword} = req.body
  
  const userId = req.user?.id;

  if(!userId){
    throw new ApiError(401, "Invalid credentials");
  }
  
  if(newPassword !== confirmPassword){
    throw new ApiError(400, "new password and confirm password do not match")
  }


  const existingUser = await prisma.user.findFirst({
    where: {id: userId },
  });

  // Одинаковый ответ на "нет пользователя" и "неверный пароль",
  // чтобы не подсказывать атакующему, какие аккаунты существуют.
  if (!existingUser || !(await existingUser.isPasswordCorrect(oldPassword))) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  const newRefreshToken = await generateRefreshToken(existingUser);
  const newAccessToken = await generateAccessToken(existingUser);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword, refreshToken: newRefreshToken },
  });

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { success: true, accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Password has been changed successfully"
      )
    );
});

export const updateBio = asyncHandler(async (req: Request, res: Response) => { 
  const {bio} = req.body;
  if(!bio || bio === ""){
    throw new ApiError(400, "Bio can not be empty")
  }

  const userId = req.user?.id

  if(!userId){
    throw new ApiError(404, "User dosn't exists");
  }
   
  const userInfo = await prisma.user.update({
    where: { id: userId },
    data: { bio:bio.trim() },
    select: { ...publicUserSelect }
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {data:userInfo},
        "Bio has been updated"
      )
    );
});

export const updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.file?.path) {
    throw new ApiError(400, "Profile image file is required");
  }

  // Нужен старый URL, чтобы потом удалить файл
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileImage: true },
  });

  const profileImageUrl = await uploadImageToStorage(req.file.path);
  if (!profileImageUrl) {
    throw new ApiError(500, "Something went wrong with image upload");
  }

  const userInfo = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: profileImageUrl },
    select: publicUserSelect,
  });

  // Удаляем старую картинку только после успешного апдейта, ошибки не роняют ответ
  if (current?.profileImage && current.profileImage !== profileImageUrl) {
    await deleteImageFromStorage(current.profileImage);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { data: userInfo }, "Profile image has been updated"));
});

export const getUserProfileData = asyncHandler(async (req: Request, res: Response) => {

  const {username} = req.params;
  
  if(!username) throw new ApiError(404, "User not found");
  
  const user = await prisma.user.findUnique({
    where: { name: username.toString() },
    select: {
      id: true,
      name: true,
      bio: true,
      profileImage: true,        // email / password / refreshToken НЕ тянем
      _count: {
        select: {
          posts: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  const { _count, ...profile } = user;
  res.status(200).json( new ApiResponse(200, { ...profile, ..._count }, "User data fetched successfully"));
});

export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const {username} = req.params;
  const loggedInUserId = req.user?.id;

  if(!loggedInUserId) throw new ApiError(401, "Unauthorized");

  if(!username) throw new ApiError(400, "Username is required");
   
  const userToFollow = await prisma.user.findUnique({
    where: {name:username.toString().trim()},
    select: {id: true, name:true}
  });

  if(!userToFollow) throw new ApiError(404, "User to follow is not found")
  
  if(userToFollow.id === loggedInUserId) {
    throw new ApiError(400, "You can not follow yourself")
  }

  //Проверим, есть ли уже подписка

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: loggedInUserId,
        followingId: userToFollow.id
      }
    }
});

if(existingFollow) throw new ApiError(409, "You are already following this user");

  const follow = await prisma.follow.create({
    data: { 
      followerId: loggedInUserId,
      followingId: userToFollow.id 
    },
    include: {
      following:{
        select: {
          id: true,
          name: true,
          profileImage: true
        }
      }
    }
  });

  return res.status(201).json(new ApiResponse(201, {following: follow.following}, "you are now following this user"))

 })

 export const unfollowUser = asyncHandler(async (req: Request, res: Response) => { 
  const {username} = req.params;
  const loggedInUserId = req.user?.id;

  if(!loggedInUserId) throw new ApiError(401, "Unauthorized");

  if(!username) throw new ApiError(400, "Username is required");
   
  const userToUnfollow = await prisma.user.findUnique({
    where: {name:username.toString().trim()},
    select: {id: true, name:true}
  });

  if(!userToUnfollow) throw new ApiError(404, "User to follow is not found")

  if(userToUnfollow.id === loggedInUserId) {
    throw new ApiError(400, "You can not follow yourself")
  }
  //Проверим, есть ли уже подписка

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: loggedInUserId,
        followingId: userToUnfollow.id
      }
    }
  });

  if(!existingFollow) throw new ApiError(409, "You are not following this user");
   
  //Удаляем

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: loggedInUserId,
        followingId: userToUnfollow.id
      }
    }
  });

  return res.status(201).json(new ApiResponse(200, null, "you have unfollowed this user"))
});
