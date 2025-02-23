"use client";

import { useState, useEffect } from "react";
import { Article } from "@/payload-types";
import { fetchUserArticles, createArticle, deleteArticle } from "./actions";
import { SanitizedCollectionPermission } from "payload";
import Button from "@/components/Button";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import LogoutButton from "@/components/auth/LogoutButton";
import Heading from "@/components/Heading";

interface SessionProps {
  user: {
    id: number;
    role?: string;
    email: string;
  };
  permissions?: SanitizedCollectionPermission;
}

export default function CreateArticle({ user, permissions }: SessionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");

  console.log("permissions client", permissions);

  // Fetch user articles when the component loads
  useEffect(() => {
    const loadArticles = async () => {
      const userArticles = await fetchUserArticles(user.id);
      setArticles(userArticles);
    };
    loadArticles();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createArticle(title, user.id);
      toast.success("Article created successfully!");
      const updatedArticles = await fetchUserArticles(user.id);
      setArticles(updatedArticles);
      setTitle("");
    } catch (err) {
      console.error("Error creating article:", err);
      toast.error("Error creating article");
    }
  };

  const handleDelete = async (articleId: string) => {
    try {
      await deleteArticle(articleId, user.id);
      toast.success("Article deleted successfully!");
      const updatedArticles = await fetchUserArticles(user.id);
      setArticles(updatedArticles);
    } catch (err) {
      console.error("Error deleting article:", err);
      toast.error("Error deleting article");
    }
  };

  return (
    <div className="mx-auto my-16 max-w-6xl">
      <Heading level="h1" size="lg">
        Profile
      </Heading>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-stone-300">
            Logged in user: <span className="font-semibold text-stone-100">{user.email}</span>
          </p>
          <p className="text-stone-300">
            Role: <span className="font-semibold text-stone-100">{user.role}</span>
          </p>
        </div>
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {permissions?.create && (
          <div>
            <Heading level="h2" size="md">
              Create Article
            </Heading>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="title" className="mb-2 block text-stone-300">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-600 bg-stone-700 p-2 text-stone-100"
                  required
                />
              </div>

              <Button type="submit" style="secondary" size="sm">
                Create Article
              </Button>
            </form>
          </div>
        )}

        <div>
          <Heading level="h2" size="md">
            My Articles
          </Heading>
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/articles/${article.slug}`} className="font-bold text-stone-100">
                        {article.title}
                      </Link>
                      <p className="text-sm text-stone-400">Slug: {article.slug}</p>
                    </div>
                    {permissions?.delete && (
                      <Button
                        onClick={() => handleDelete(String(article.id))}
                        style="secondary"
                        size="sm"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400">No articles</p>
          )}
        </div>
      </div>
    </div>
  );
}
