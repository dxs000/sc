import api from "../lib/axios";

export type PostAuthor = {
  id: string;
  name: string | null;
  profileImage: string | null;
};

export type PostImage = {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  author: PostAuthor;
  images: PostImage[];
  _count?: {
    comments?: number;
    likes?: number;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PostsPage = {
  data: Post[];
  pagination: Pagination;
};

export const getAllPosts = async (page = 1, limit = 10): Promise<PostsPage> => {
  const response = await api.get("/posts/all-post", {
    params: { page, limit },
  });
  return response.data as PostsPage;
};

export const togglePostLike = async (postId: string) => {
  const response = await api.post(`/likes/like-post/${postId}`);
  return response.data;
};
