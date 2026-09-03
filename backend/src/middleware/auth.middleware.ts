import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "./errorHandler";
import { verifyAccessToken } from "../utils/tokens";
import prisma from "../prisma";

export const verifyJWT = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Токен либо из httpOnly-cookie, либо из заголовка Authorization: Bearer <token>
    const token =
      req.cookies?.accessToken ??
      req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: token missing");
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      // и просроченный, и битый токен → 401
      throw new ApiError(401, "Unauthorized: invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized: user no longer exists");
    }

    req.user = user;
    next();
  }
);