"use client";

import { Hits, InstantSearch, useSearchBox } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { Link, useRouter } from "@/i18n/routing";
import SidePanel from "./SidePanel";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";

const SearchContext = createContext<{
  query: string;
  setSearchQuery: (query: string) => void;
}>({
  query: "",
  setSearchQuery: () => {},
});

function SearchContextProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query: searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

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

interface Hit {
  title: string;
  slug: string;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <Link
      href={`/articles/${hit.slug}`}
      className="search-panel-hit block border border-transparent outline-none focus-visible:border-amber-500"
    >
      <div className="mb-4 rounded-lg bg-stone-800 p-4">
        <h2 className="text-xl font-bold">{hit.title}</h2>
        <div className="mt-4 text-sm">Slug: {hit.slug} </div>
      </div>
    </Link>
  );
}

function CustomSearchBox({ inSidePanel = false }: { inSidePanel?: boolean }) {
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchQuery } = useContext(SearchContext);
  const t = useTranslations("search");
  const router = useRouter();

  useEffect(() => {
    if (inSidePanel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  }, [inSidePanel]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    }
  };

  return (
    <div className="relative mt-10">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        className="search-panel-input w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white placeholder-stone-400 focus:border-amber-500 focus:outline-none"
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

function AdvancedSearchLink() {
  const { query } = useContext(SearchContext);
  const t = useTranslations("search");
  return (
    <div className="p-10 text-center">
      <Link
        href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        className="p-4 text-amber-500 underline-offset-2 hover:underline"
      >
        {t("advancedSearch")}
      </Link>
    </div>
  );
}

export default function SearchSidePanel() {
  const t = useTranslations("search");
  return (
    <SearchContextProvider>
      <SidePanel
        openLabel={
          <button className="group flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 group-hover:text-amber-500" />
            <span className="text-xs font-medium uppercase">{t("search")}</span>
          </button>
        }
        title={t("search")}
        footer={<AdvancedSearchLink />}
      >
        <div className="flex flex-col gap-10">
          <InstantSearch searchClient={searchClient} indexName={ELASTIC_INDEX_NAME}>
            <CustomSearchBox inSidePanel={true} />
            <Hits hitComponent={Hit} />
          </InstantSearch>
        </div>
      </SidePanel>
    </SearchContextProvider>
  );
}
