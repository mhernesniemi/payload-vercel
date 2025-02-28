"use client";

import type { LexicalCommand } from "@payloadcms/richtext-lexical/lexical";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $createRangeSelection,
  $setSelection,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { useEffect, useState, useRef } from "react";
import type { PluginComponent } from "@payloadcms/richtext-lexical";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const INSERT_TEST_COMMAND: LexicalCommand<void> = createCommand("INSERT_TEST_COMMAND");

export const TestPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [surroundingText, setSurroundingText] = useState("");
  const [selectionInfo, setSelectionInfo] = useState<{
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Style definitions
  const styles = {
    container: {
      position: "absolute",
      zIndex: 10,
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "300px",
      top: "40px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    textarea: {
      width: "100%",
      minHeight: "50px",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    button: {
      padding: "8px 12px",
      backgroundColor: "#0070f3",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "8px",
    },
    cancelButton: {
      padding: "8px 12px",
      backgroundColor: "#f3f3f3",
      color: "#333",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  const handleGenerateContent = async () => {
    if (!prompt.trim() || !selectedText || !selectionInfo) return;

    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `First we define the data sources and based on their data we generate the response. 1. Prompt: "${prompt}". 2. Surrounding text: "${surroundingText}". 3. Selected text: "${selectedText}". Use the same language as in data sources, use correct grammar and punctuation for the language. Give the response in that form that can be used directly to replace the selected text.`,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      if (response) {
        // Use editor.update() method to update the text
        editor.update(() => {
          // Restore the original selection
          const { anchorKey, anchorOffset, focusKey, focusOffset } = selectionInfo;
          const anchorNode = editor.getElementByKey(anchorKey);
          const focusNode = editor.getElementByKey(focusKey);

          if (anchorNode && focusNode) {
            const selection = $createRangeSelection();
            selection.anchor.set(anchorKey, anchorOffset, "text");
            selection.focus.set(focusKey, focusOffset, "text");
            $setSelection(selection);

            // Now that the selection is restored, we can replace the text
            const currentSelection = $getSelection();
            if ($isRangeSelection(currentSelection)) {
              currentSelection.insertText(response.replace(/^"|"$/g, ""));
            }
          }
        });

        setIsFormVisible(false);
        setPrompt("");
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TEST_COMMAND,
      () => {
        // Save the selected text and its position as soon as the command is triggered
        editor.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const text = selection.getTextContent();
            setSelectedText(text);

            // Get surrounding text (paragraph or parent node content)
            try {
              const anchorNode = selection.anchor.getNode();

              // Get the parent paragraph or block
              const parentNode = anchorNode.getParent() || anchorNode;
              const fullText = parentNode.getTextContent();

              // Set surrounding text (full paragraph)
              setSurroundingText(fullText);
            } catch (error) {
              console.error("Error getting surrounding text:", error);
              setSurroundingText("");
            }

            // Save the selection so we can restore it later
            const anchor = selection.anchor;
            const focus = selection.focus;

            setSelectionInfo({
              anchorKey: anchor.key,
              anchorOffset: anchor.offset,
              focusKey: focus.key,
              focusOffset: focus.offset,
            });
          }
        });

        setIsFormVisible(true);
        // Give focus to the textarea with a small delay
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  if (!isFormVisible) return null;

  return (
    <div style={styles.container as React.CSSProperties}>
      {selectedText ? (
        <>
          <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
            <strong>Selected text:</strong> {selectedText.length > 50 ? `${selectedText.substring(0, 50)}...` : selectedText}
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here..."
            style={styles.textarea as React.CSSProperties}
          />
          <div>
            <button onClick={handleGenerateContent} disabled={isLoading} style={styles.button as React.CSSProperties}>
              {isLoading ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setPrompt("");
              }}
              style={styles.cancelButton as React.CSSProperties}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>No text selected. Please select text in the editor first.</p>
          <button
            onClick={() => {
              setIsFormVisible(false);
            }}
            style={styles.cancelButton as React.CSSProperties}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
