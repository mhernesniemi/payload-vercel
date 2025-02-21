"use client";

import { Hits, InstantSearch, useSearchBox, useStats } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SearchHit from "@/components/SearchHit";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";

interface SearchRequest {
  params?: {
    query?: string;
  };
}

const searchClient = {
  ...createClient({
    url: "/api/search",
  }),
  search(requests: SearchRequest[]) {
    const shouldSearch = requests.some(
      (request: SearchRequest) => request.params?.query && request.params.query.length > 0,
    );

    if (!shouldSearch) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return createClient({ url: "/api/search" }).search(requests);
  },
};

function CustomSearchBox() {
  const { query, refine } = useSearchBox();
  const searchParams = useSearchParams();
  const t = useTranslations("search");

  useEffect(() => {
    const defaultQuery = searchParams.get("q");
    if (defaultQuery && !query) {
      refine(defaultQuery);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={t("searchPlaceholder")}
        autoFocus
        className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white placeholder-stone-400"
      />
      {query && (
        <button
          onClick={() => refine("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
          aria-label={t("clearSearch")}
          tabIndex={-1}
        >
          <XMarkIcon className="h-5 w-5 stroke-2" />
        </button>
      )}
    </div>
  );
}

function SearchStats() {
  const { nbHits } = useStats();
  const { query } = useSearchBox();
  const t = useTranslations("search");

  if (!query) {
    return null;
  }

  return (
    <div className="text-stone-400">
      {nbHits} {nbHits === 1 ? t("result") : t("results")}
    </div>
  );
}

export default function SearchTemplate() {
  return (
    <div className="mx-auto max-w-screen-md py-16">
      <InstantSearch searchClient={searchClient} indexName={ELASTIC_INDEX_NAME}>
        <div className="flex flex-col gap-10">
          <CustomSearchBox />
          <SearchStats />
          <Hits hitComponent={SearchHit} />
        </div>
      </InstantSearch>
    </div>
  );
}
