"use client";

import { useState, useEffect } from "react";
import { Article } from "@/payload-types";
import { fetchUserArticles, createArticle } from "./actions";
import { SanitizedCollectionPermission } from "payload";

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
      await createArticle(title);
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
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Artikkelien hallinta</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block">
            Otsikko:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Luo artikkeli
        </button>
      </form>

      {message && <div className="mb-4 rounded bg-green-100 p-2 text-green-700">{message}</div>}

      <div>
        <h2 className="mb-4 text-xl font-bold">Omat artikkelit</h2>
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="rounded border p-4">
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-gray-500">Slug: {article.slug}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Ei artikkeleita</p>
        )}
      </div>
    </div>
  );
}
