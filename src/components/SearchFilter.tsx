import { CheckIcon } from "@heroicons/react/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useRefinementList } from "react-instantsearch";

interface CategoryFilterProps {
  attribute: string;
  operator: "or" | "and";
}

export default function CategoryFilter({
  attribute = "categories",
  operator = "or",
}: CategoryFilterProps) {
  const { items, refine } = useRefinementList({
    attribute: attribute,
    operator: operator,
  });

  const selectedItems = items.filter((item) => item.isRefined);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Kategoriat</h2>
      <Listbox
        value={selectedItems}
        onChange={(selected) => {
          // Compare selected categories and update refinements
          items.forEach((item) => {
            const isSelected = selected.some((s) => s.value === item.value);
            if (isSelected !== item.isRefined) {
              refine(item.value);
            }
          });
        }}
        multiple
      >
        <div className="relative mt-1">
          <ListboxButton className="relative w-full cursor-default rounded-lg border border-stone-700 bg-stone-900 py-2 pl-3 pr-10 text-left text-white">
            <span className="block truncate">
              {selectedItems.length === 0
                ? "Valitse kategoriat"
                : `${selectedItems.length} kategoriaa valittu`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-stone-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-stone-700 bg-stone-900 py-1 text-base shadow-lg focus:outline-none">
              {items.map((item) => (
                <ListboxOption
                  key={item.value}
                  value={item}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-stone-800 text-white" : "text-stone-200"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {item.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-500">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
