"use client";

import { InstantSearch, connectSearchBox, connectHits } from "react-instantsearch-dom";
import createClient from "@searchkit/instantsearch-client";
import SearchHit from "./search-hit";
import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";

const searchClient = createClient({
  url: "/api/search",
});

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine }) => {
  return (
    <ComboboxInput
      className="w-64 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
      placeholder="Hae sivustolta..."
      value={currentRefinement}
      onChange={(e) => refine(e.target.value)}
    />
  );
});

const CustomHits = connectHits(({ hits }) => {
  return (
    <ComboboxOptions className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      {hits.map((hit) => (
        <ComboboxOption key={hit.objectID} value={hit}>
          <SearchHit hit={hit} />
        </ComboboxOption>
      ))}
    </ComboboxOptions>
  );
});

export default function Searchbox() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <InstantSearch searchClient={searchClient} indexName="articles">
        <Combobox value={query} onChange={(value) => setQuery(value || "")}>
          <CustomSearchBox />
          <CustomHits />
        </Combobox>
      </InstantSearch>
    </div>
  );
}
