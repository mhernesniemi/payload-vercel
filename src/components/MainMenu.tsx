"use client";

import { Popover, PopoverPanel, PopoverButton, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { parseMenuLinks } from "../lib/parseLink";
import { MenuItem } from "../types/menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SidePanelMenu from "./SidePanelMenu";
import clsx from "clsx";

interface MainMenuProps {
  items: MenuItem[];
}

export function MainMenu({ items }: MainMenuProps) {
  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Popover key={item.id} className="relative px-3 py-2">
          <PopoverButton className="main-nav-item group flex items-center font-medium focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-amber-500">
            <span className="transition-colors duration-200 group-data-[open]:text-amber-500">
              {item.label}
            </span>
            <ChevronDownIcon className="ml-2 h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover:text-amber-500 group-data-[open]:rotate-180 group-data-[open]:text-amber-500" />
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute left-1/2 z-10 mt-3 -translate-x-1/2 transform px-2">
              <div className="overflow-hidden rounded-lg border border-stone-700 shadow-lg ring-1 ring-black ring-opacity-5">
                <div
                  // If the item has grandchildren, use a grid layout
                  className={clsx(
                    "bg-stone-800 *:relative",
                    item.children?.some(
                      (child) => child.grandchildren && child.grandchildren.length > 0,
                    )
                      ? "grid gap-x-4 gap-y-10 px-10 pb-10 pt-6"
                      : "min-w-[200px] pb-8 pl-10 pr-6 pt-6",
                  )}
                  // Calculate the number of columns
                  style={
                    item.children?.some(
                      (child) => child.grandchildren && child.grandchildren.length > 0,
                    )
                      ? {
                          gridTemplateColumns: `repeat(${Math.min(
                            3,
                            item.children?.filter(
                              (child) => child.grandchildren && child.grandchildren.length > 0,
                            ).length || 1,
                          )}, 200px)`,
                        }
                      : undefined
                  }
                >
                  {/* Child components with grandchildren */}
                  {item.children
                    ?.filter((child) => child.grandchildren && child.grandchildren.length > 0)
                    .map((child) => (
                      <div key={child.id}>
                        <h3 className="mb-3 text-sm font-medium leading-snug tracking-wide text-stone-400">
                          {child.label}
                        </h3>
                        <div className="space-y-4">
                          {child.grandchildren?.map((grandchild) => {
                            const { linkUrl, linkLabel } = parseMenuLinks(grandchild);
                            return (
                              <div key={grandchild.id}>
                                <Link
                                  href={linkUrl ?? ""}
                                  className="inline-block leading-snug transition duration-150 ease-in-out hover:text-amber-500"
                                >
                                  {linkLabel}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                  {/* Child components without grandchildren */}
                  {item.children?.some((child) => !child.grandchildren?.length) && (
                    <div className="space-y-4">
                      {item.children
                        .filter((child) => !child.grandchildren?.length)
                        .map((child) => {
                          const { linkUrl } = parseMenuLinks(child);
                          return (
                            <div key={child.id}>
                              <Link
                                href={linkUrl ?? ""}
                                className="inline-block leading-snug transition duration-150 ease-in-out hover:text-amber-500"
                              >
                                {child.label}
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      );
    }

    const { linkUrl } = parseMenuLinks(item);

    return (
      <Link
        key={item.id}
        href={linkUrl ?? ""}
        className="px-3 py-2 text-base font-medium transition-colors hover:text-amber-500"
      >
        {item.label}
      </Link>
    );
  };

  return <nav className="flex items-center justify-center gap-4">{items.map(renderMenuItem)}</nav>;
}

type SidePanelLink = {
  title: string;
  url: string;
};

type SidePanelSubLink = SidePanelLink & {
  sublinks?: SidePanelLink[];
};

type SidePanelItem = SidePanelLink & {
  sublinks?: SidePanelSubLink[];
};

export function MobileMenu({ items }: { items: MenuItem[] }) {
  const convertGrandchildToSidePanelLink = (grandchild: MenuItem): SidePanelLink => {
    const { linkUrl } = parseMenuLinks(grandchild);
    return {
      title: grandchild.label,
      url: linkUrl ?? "",
    };
  };

  const convertChildToSidePanelSubLink = (child: MenuItem): SidePanelSubLink => {
    const { linkUrl } = parseMenuLinks(child);
    return {
      title: child.label,
      url: linkUrl ?? "",
      sublinks: child.grandchildren?.map(convertGrandchildToSidePanelLink),
    };
  };

  const convertToSidePanelItems = (menuItems: MenuItem[]): SidePanelItem[] => {
    return menuItems.map((item) => {
      const { linkUrl } = parseMenuLinks(item);
      return {
        title: item.label,
        url: linkUrl ?? "",
        sublinks: item.children?.map(convertChildToSidePanelSubLink),
      };
    });
  };

  const sidePanelItems = convertToSidePanelItems(items);
  return (
    <div className="flex items-center">
      <SidePanelMenu items={sidePanelItems} />
    </div>
  );
}
