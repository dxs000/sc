import { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";
import PostCard from "./PostCard";
import { getAllPosts, type Post } from "../../services/post.service";

const FeedComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (nextPage: number, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const result = await getAllPosts(nextPage, 10);
      setPosts((prev) => (append ? [...prev, ...result.data] : result.data));
      setPage(result.pagination.page);
      setHasNextPage(result.pagination.hasNextPage);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Не удалось загрузить обсуждения";
      setError(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void loadPosts(1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10" role="status" aria-label="Загрузка ленты">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
        <p className="text-sm text-danger">{error}</p>
        <button
          type="button"
          onClick={() => void loadPosts(1)}
          className="mt-3 text-sm font-medium text-brand"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
        <p className="text-sm text-muted">
          Пока нет опубликованных обсуждений.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Лента обсуждений">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <button
          type="button"
          onClick={() => void loadPosts(page + 1, true)}
          disabled={loadingMore}
          className="h-11 rounded-xl border border-border bg-surface text-sm font-medium text-ink active:scale-[0.98] disabled:opacity-70"
        >
          {loadingMore ? "Загрузка…" : "Показать ещё"}
        </button>
      )}
    </section>
  );
};

export default FeedComponent;
