"use client";

import { createClientFeature, toolbarFormatGroupWithItems } from "@payloadcms/richtext-lexical/client";
import { INSERT_TEST_COMMAND, TestPlugin } from "./plugin";
import { TestIcon } from "./icon";

export const TestClientFeature = createClientFeature({
  toolbarFixed: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: TestIcon,
          key: "testFeature",
          label: ({ i18n }) => {
            return i18n.t("lexical:testFeature:label");
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_TEST_COMMAND, undefined);
          },
        },
      ]),
    ],
  },
  plugins: [{ Component: TestPlugin, position: "normal" }],
});
