"use client";

import {
  InstantSearch,
  useSearchBox,
  useStats,
  useRefinementList,
  useCurrentRefinements,
  Configure,
  Hits,
} from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";
import SearchFilter from "@/components/SearchFilter";
import Heading from "@/components/Heading";
import SearchHit from "@/components/SearchHit";
import SearchPagination from "@/components/SearchPagination";

const searchClient = createClient({
  url: "/api/search",
});

function SearchBox() {
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
  const t = useTranslations("search");

  return (
    <div className="text-stone-400">
      {nbHits} {nbHits === 1 ? t("result") : t("results")}
    </div>
  );
}

function CurrentRefinements() {
  const { items, refine } = useCurrentRefinements();
  const t = useTranslations("search");

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap gap-2">
          {item.refinements.map((refinement) => (
            <button
              key={refinement.label}
              onClick={() => refine(refinement)}
              className="flex items-center gap-2 rounded-full bg-stone-700 px-3 py-1 text-sm text-white hover:bg-stone-600"
            >
              <span>
                {t(item.label.toLowerCase())}:{" "}
                <span className="capitalize">{refinement.label}</span>
              </span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function SearchComponents() {
  const t = useTranslations("search");
  const { query } = useSearchBox();
  const refinementStates = {
    categories: useRefinementList({
      attribute: "categories",
      operator: "or",
    }),
    collection: useRefinementList({
      attribute: "collection",
      operator: "or",
    }),
  };

  // Check if there are any selections in the refinement lists
  const hasActiveRefinements = Object.values(refinementStates).some(({ items }) =>
    items.some((item) => item.isRefined),
  );

  const shouldShowResults = Boolean(query) || hasActiveRefinements;

  return (
    <div>
      <Heading level="h1" size="xl" className="">
        {t("search")}
      </Heading>
      <div className="flex flex-col gap-10">
        <SearchBox />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <SearchFilter attribute="categories" title={t("categories")} operator="or" />
          <SearchFilter attribute="collection" title={t("collections")} operator="or" />
        </div>
        <CurrentRefinements />
        {shouldShowResults && (
          <div className="space-y-4">
            <SearchStats />
            <div className="space-y-12">
              <Hits hitComponent={SearchHit} />
              <SearchPagination />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchTemplate() {
  return (
    <div className="mx-auto max-w-screen-md py-16">
      <InstantSearch searchClient={searchClient} indexName={ELASTIC_INDEX_NAME} routing>
        <Configure hitsPerPage={20} />
        <SearchComponents />
      </InstantSearch>
    </div>
  );
}
