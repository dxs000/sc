import { useState } from "react";
import type { Post } from "../../services/post.service";
import { togglePostLike } from "../../services/post.service";

type PostCardProps = {
  post: Post;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PostCard = ({ post }: PostCardProps) => {
  const commentsCount = post._count?.comments ?? 0;
  const [likesCount, setLikesCount] = useState(post._count?.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

  const handleLike = async () => {
    if (likePending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    setLikePending(true);
    try {
      await togglePostLike(post.id);
    } catch {
      setLiked(!nextLiked);
      setLikesCount((count) => Math.max(0, count + (nextLiked ? -1 : 1)));
    } finally {
      setLikePending(false);
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <header className="flex items-center gap-3">
        {post.author.profileImage ? (
          <img
            src={post.author.profileImage}
            alt={post.author.name ?? "Автор"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {post.author.name?.[0]?.toUpperCase() ?? "C"}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {post.author.name ?? "Участник"}
          </p>
          <time className="text-xs text-muted" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>
      </header>

      <h2 className="mt-4 text-base font-semibold text-ink">{post.title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
        {post.content}
      </p>

      {post.images.length > 0 && (
        <div
          className={`mt-4 grid gap-2 ${
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt=""
              className="max-h-80 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <footer className="mt-4 flex items-center gap-4 text-sm text-muted">
        <button
          type="button"
          onClick={handleLike}
          disabled={likePending}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 active:scale-95 ${
            liked ? "text-brand font-medium" : ""
          }`}
          aria-pressed={liked}
        >
          <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
          <span>{likesCount}</span>
          <span className="sr-only">Нравится</span>
        </button>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true">☰</span>
          {commentsCount} коммент.
        </span>
      </footer>
    </article>
  );
};

export default PostCard;
