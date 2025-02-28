"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { INSERT_TEST_COMMAND, TestPlugin } from "./plugin";
import { TestIcon } from "./icon";
import { $isRangeSelection } from "@payloadcms/richtext-lexical/lexical";

export const TestClientFeature = createClientFeature({
  toolbarInline: {
    groups: [
      {
        key: "testGroup",
        type: "buttons",
        items: [
          {
            ChildComponent: TestIcon,
            key: "testFeature",
            label: ({ i18n }) => {
              return i18n.t("lexical:testFeature:label");
            },
            isActive: ({ selection }) => {
              return $isRangeSelection(selection);
            },
            onSelect: ({ editor }) => {
              editor.dispatchCommand(INSERT_TEST_COMMAND, undefined);
            },
          },
        ],
      },
    ],
  },
  plugins: [{ Component: TestPlugin, position: "normal" }],
});
