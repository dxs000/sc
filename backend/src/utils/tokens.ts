import jwt from "jsonwebtoken";
import type { SignOptions, JwtPayload } from "jsonwebtoken";
import type { User } from "../generated/prisma/client.js";

// Что мы кладём в access-токен
export interface AccessTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

// Что кладём в refresh-токен
export interface RefreshTokenPayload extends JwtPayload {
  id: string;
}

export function generateAccessToken(user: Pick<User, "id" | "email">) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? "15m" } as SignOptions
  );
}

export function generateRefreshToken(user: Pick<User, "id">) {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? "7d" } as SignOptions
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as RefreshTokenPayload;
}