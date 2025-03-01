"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { INSERT_TEST_COMMAND, TestPlugin } from "./plugin";
import { TestIcon } from "./icon";
import { $isRangeSelection } from "@payloadcms/richtext-lexical/lexical";

export const AIRichTextClientFeature = createClientFeature({
  toolbarInline: {
    groups: [
      {
        key: "aiRichTextGroup",
        type: "buttons",
        items: [
          {
            ChildComponent: TestIcon,
            key: "aiRichTextFeature",
            label: ({ i18n }) => {
              return i18n.t("lexical:aiRichTextFeature:label");
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
