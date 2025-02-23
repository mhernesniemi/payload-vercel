"use client";

import { useState, useEffect } from "react";
import { Article } from "@/payload-types";
import { fetchUserArticles, createArticle } from "./actions";
import { SanitizedCollectionPermission } from "payload";
import Button from "@/components/Button";

interface SessionProps {
  user: {
    id: number;
    role?: string;
  };
  permissions: SanitizedCollectionPermission;
}

export default function CreateArticle({ user }: SessionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  console.log("user", user);

  // Haetaan käyttäjän artikkelit kun komponentti latautuu
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
      setMessage("Artikkeli luotu onnistuneesti!");
      // Päivitetään artikkelilista
      const updatedArticles = await fetchUserArticles(user.id);
      setArticles(updatedArticles);
      // Tyhjennetään lomake
      setTitle("");
    } catch (err) {
      console.error("Virhe artikkelin luonnissa:", err);
      setMessage("Virhe artikkelin luonnissa");
    }
  };

  return (
    <div className="mx-auto my-16 max-w-6xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Artikkelien hallinta -osio */}
        <div>
          <h1 className="mb-6 text-2xl font-bold text-stone-100">Artikkelien hallinta</h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="title" className="mb-2 block text-stone-300">
                Otsikko:
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
              Luo artikkeli
            </Button>
          </form>

          {message && (
            <div className="mb-4 rounded-lg bg-green-900/20 p-3 text-green-400 ring-1 ring-green-900">
              {message}
            </div>
          )}
        </div>

        {/* Omat artikkelit -osio */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-stone-100">Omat artikkelit</h2>
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                >
                  <h3 className="font-bold text-stone-100">{article.title}</h3>
                  <p className="text-sm text-stone-400">Slug: {article.slug}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400">Ei artikkeleita</p>
          )}
        </div>
      </div>
    </div>
  );
}
