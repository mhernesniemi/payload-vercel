"use client";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import Link from "next/link";
import parseLink from "../lib/parseLink";

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
  id: string;
};

interface MainMenuProps {
  items: MenuItem[];
}

export default function MainMenu({ items }: MainMenuProps) {
  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Popover key={item.id} className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={` ${open ? "text-primary" : "text-gray-700"} hover:text-primary group inline-flex items-center rounded-md px-3 py-2 text-base font-medium focus:outline-none`}
              >
                <span>{item.label}</span>
                <ChevronDownIcon
                  className={` ${open ? "text-primary rotate-180" : "text-gray-400"} ml-2 h-5 w-5 transition-transform duration-200`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white p-6">
                      {(item.children || []).map((child) => (
                        <Link
                          key={child.id}
                          href={parseLink(child).url}
                          className="-m-3 flex items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-base font-medium text-gray-900">{child.label}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      );
    }

    return (
      <Link
        key={item.id}
        href={parseLink(item).url}
        className="hover:text-primary px-3 py-2 text-base font-medium text-gray-700"
      >
        {item.label}
      </Link>
    );
  };

  return <nav className="flex items-center space-x-4">{items.map(renderMenuItem)}</nav>;
}
