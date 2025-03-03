"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { $isRangeSelection } from "@payloadcms/richtext-lexical/lexical";
import { AIIcon } from "./icon";
import { INSERT_AI_ASSISTANT_COMMAND, TestPlugin } from "./plugin";

export const AIRichTextClientFeature = createClientFeature({
  toolbarInline: {
    groups: [
      {
        key: "aiRichTextGroup",
        type: "buttons",
        items: [
          {
            ChildComponent: AIIcon,
            key: "aiRichTextFeature",
            label: ({ i18n }) => {
              return i18n.t("lexical:aiRichTextFeature:label");
            },
            isActive: ({ selection }) => {
              return $isRangeSelection(selection);
            },
            onSelect: ({ editor }) => {
              editor.dispatchCommand(INSERT_AI_ASSISTANT_COMMAND, undefined);
            },
          },
        ],
      },
    ],
  },
  slashMenu: {
    groups: [
      {
        key: "aiTools",
        label: "AI Tools",
        items: [
          {
            Icon: AIIcon,
            key: "aiAssistant",
            keywords: ["ai", "assistant"],
            label: "AI Assistant",
            onSelect: ({ editor }) => {
              editor.dispatchCommand(INSERT_AI_ASSISTANT_COMMAND, undefined);
            },
          },
        ],
      },
    ],
  },
  plugins: [{ Component: TestPlugin, position: "normal" }],
});
