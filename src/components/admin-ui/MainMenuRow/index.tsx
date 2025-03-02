"use client";

import { useRowLabel } from "@payloadcms/ui";

type MainMenuData = {
  label?: string;
  addLinks?: boolean;
};

export const MainMenuRow = () => {
  const { data, rowNumber } = useRowLabel<MainMenuData>();

  const customLabel = data.label || `Menu Item ${String(rowNumber).padStart(2, "0")}`;

  return <div>{customLabel}</div>;
};
