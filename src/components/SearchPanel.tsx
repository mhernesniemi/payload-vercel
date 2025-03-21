"use client";

import { Link, useRouter } from "@/i18n/routing";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import createClient from "@searchkit/instantsearch-client";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { InstantSearch, useHits, useSearchBox, useStats } from "react-instantsearch";
import SidePanel from "./SidePanel";

interface Hit {
  title: string;
  slug: string;
  collection?: string;
}
interface SearchRequest {
  params?: {
    query?: string;
  };
}

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

const searchClient = {
  ...createClient({
    url: "/api/search",
  }),

  // If no search query, return empty results
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

// Only used for screen readers
function SearchStats() {
  const { nbHits } = useStats();
  const t = useTranslations("search");

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {nbHits} {nbHits === 1 ? t("result") : t("results")}
    </div>
  );
}

function CustomSearchBox({ inSidePanel = false }: { inSidePanel?: boolean }) {
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchQuery } = useContext(SearchContext);
  const t = useTranslations("search");
  const router = useRouter();
  const [selectedHit, setSelectedHit] = useState<Hit | null>(null);
  const { items } = useHits<Hit>();

  useEffect(() => {
    // Focus the search box when the side panel is opened
    if (inSidePanel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  }, [inSidePanel]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const handleSelectHit = (hit: Hit) => {
    setSelectedHit(hit);
    if (hit) {
      router.push(`/articles/${hit.slug}`);
    }
  };

  return (
    <div className="relative mt-2">
      <Combobox value={selectedHit} onChange={handleSelectHit}>
        <div className="relative">
          <ComboboxInput
            ref={inputRef}
            as="input"
            displayValue={() => query}
            onChange={(e) => refine(e.target.value)}
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

        {items && items.length > 0 && (
          <ComboboxOptions
            className="mt-6"
            anchor="bottom"
            unmount={false}
            static={true}
            style={{
              width: "var(--input-width)",
              maxWidth: "var(--input-width)",
            }}
          >
            {items.map((hit: Hit) => (
              <ComboboxOption key={hit.slug} value={hit} className="outline-none">
                <div className="mb-4 flex items-center justify-between gap-1 rounded-lg border-2 border-stone-700 p-4 data-[focus]:border-amber-500">
                  <h2 className="text-lg font-bold">{hit.title}</h2>
                  <div className="text-xs uppercase text-stone-400">{hit.collection}</div>
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </Combobox>
    </div>
  );
}

function AdvancedSearchLink() {
  const { query } = useContext(SearchContext);
  const t = useTranslations("search");
  return (
    <div className="pb-10 pt-4 text-center">
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
  const locale = useLocale();
  return (
    <SearchContextProvider>
      <SidePanel
        openLabel={
          <button className="group flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 group-hover:text-amber-500" />
            <span className="hidden text-xs font-medium uppercase xl:block">{t("search")}</span>
          </button>
        }
        title={t("search")}
        footer={<AdvancedSearchLink />}
      >
        <div className="flex flex-col gap-2">
          <InstantSearch searchClient={searchClient} indexName={`${ELASTIC_INDEX_NAME}_${locale}`}>
            <div className="sticky top-0 z-10 bg-stone-800 pb-2 pt-4">
              <CustomSearchBox inSidePanel={true} />
            </div>
            <SearchStats />
          </InstantSearch>
        </div>
      </SidePanel>
    </SearchContextProvider>
  );
}
