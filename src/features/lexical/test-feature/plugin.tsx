"use client";

import type { LexicalCommand } from "@payloadcms/richtext-lexical/lexical";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import type { PluginComponent } from "@payloadcms/richtext-lexical";

export const INSERT_TEST_COMMAND: LexicalCommand<void> = createCommand("INSERT_TEST_COMMAND");

export const TestPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TEST_COMMAND,
      () => {
        // Tässä voit tehdä jotain kun painiketta painetaan
        // Esimerkiksi näyttää viestin
        alert("Testi ominaisuus toimii!");
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
};
