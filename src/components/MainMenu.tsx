"use client";

import { Popover, PopoverPanel, PopoverButton, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import parseLink from "../lib/parseLink";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SidePanelMenu from "./SidePanelMenu";

export type MenuItem = {
  label: string;
  onlyLabel: null | string;
  link: {
    isExternal: boolean | null;
    internalUrl?: {
      relationTo: string;
      value: {
        id: number;
        title: string;
        slug: string;
      };
    };
    externalUrl?: string;
  };
  children?: MenuItem[];
  grandchildren?: MenuItem[];
  id: string;
};

interface MainMenuProps {
  items: MenuItem[];
}

export function MainMenu({ items }: MainMenuProps) {
  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Popover key={item.id} className="relative">
          <PopoverButton className="main-nav-item group flex items-center font-medium focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-amber-500">
            <span>{item.label}</span>
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
            <PopoverPanel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2">
              <div className="overflow-hidden rounded-lg border border-stone-700 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-stone-800 p-6">
                  {(item.children || []).map((child) => (
                    <div key={child.id}>
                      <Link
                        href={parseLink(child).url}
                        className="-m-3 flex items-center rounded-lg p-3 text-stone-100 transition duration-150 ease-in-out hover:text-amber-500"
                      >
                        <div>
                          <p className="text-base font-medium">{child.label}</p>
                        </div>
                      </Link>
                      {child.grandchildren && child.grandchildren.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2">
                          {child.grandchildren.map((grandchild) => (
                            <Link
                              key={grandchild.id}
                              href={parseLink(grandchild).url}
                              className="block text-sm text-stone-300 transition duration-150 ease-in-out hover:text-amber-500"
                            >
                              {grandchild.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      );
    }

    return (
      <Link
        key={item.id}
        href={parseLink(item).url}
        className="px-3 py-2 text-base font-medium transition-colors hover:text-amber-500"
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="hidden items-center justify-center space-x-4 lg:flex">
      {items.map(renderMenuItem)}
    </nav>
  );
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
  const convertGrandchildToSidePanelLink = (grandchild: MenuItem): SidePanelLink => ({
    title: grandchild.label,
    url: parseLink(grandchild).url,
  });

  const convertChildToSidePanelSubLink = (child: MenuItem): SidePanelSubLink => ({
    title: child.label,
    url: parseLink(child).url,
    sublinks: child.grandchildren?.map(convertGrandchildToSidePanelLink),
  });

  const convertToSidePanelItems = (menuItems: MenuItem[]): SidePanelItem[] => {
    return menuItems.map((item) => ({
      title: item.label,
      url: parseLink(item).url,
      sublinks: item.children?.map(convertChildToSidePanelSubLink),
    }));
  };

  const sidePanelItems = convertToSidePanelItems(items);
  return (
    <div className="flex items-center lg:hidden">
      <SidePanelMenu items={sidePanelItems} />
    </div>
  );
}
