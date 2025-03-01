"use client";

import type { LexicalCommand } from "@payloadcms/richtext-lexical/lexical";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $createRangeSelection,
  $setSelection,
  $isRootOrShadowRoot,
  $insertNodes,
  $createParagraphNode,
  $createTextNode,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { useEffect, useState, useRef } from "react";
import type { PluginComponent } from "@payloadcms/richtext-lexical";
import { generateAdminContent } from "./actions";
import { useField } from "@payloadcms/ui";

export const INSERT_AI_ASSISTANT_COMMAND: LexicalCommand<void> = createCommand("INSERT_AI_ASSISTANT_COMMAND");

export const TestPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [_surroundingText, setSurroundingText] = useState("");
  const [selectionInfo, setSelectionInfo] = useState<{
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
  } | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetching context data from the title and description fields
  const { value: title = "" } = useField<string>({ path: "title" });
  const { value: description = "" } = useField<string>({ path: "description" });

  // Style definitions
  const styles = {
    container: {
      position: "absolute",
      zIndex: 10,
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
    contextInfo: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "8px",
    },
  };

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      // If we have selected text, use it as content
      // If not, create completely new content based on the prompt
      const content = hasSelection ? selectedText : "";

      // Using the title and description fields as context
      const response = await generateAdminContent(prompt, title, description, content, "content", {});

      if (response) {
        // Use editor.update() method to update the text
        editor.update(() => {
          if (hasSelection && selectionInfo) {
            // If there's a text selection, replace it with generated content
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
          } else {
            // If no text is selected, add new content at cursor position
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // Insert text at cursor position
              selection.insertText(response.replace(/^"|"$/g, ""));
            } else {
              // If no selection exists, add a new paragraph with text at the end of the document
              const root = $getSelection()?.getNodes()[0]?.getTopLevelElement() || null;
              const target = root ? root.getNextSibling() || root : null;

              if (target && $isRootOrShadowRoot(target.getParent())) {
                const textNode = $createTextNode(response.replace(/^"|"$/g, ""));
                const paragraphNode = $createParagraphNode();
                paragraphNode.append(textNode);
                $insertNodes([paragraphNode]);
              } else {
                // Or to the document root if nothing else is found
                const textNode = $createTextNode(response.replace(/^"|"$/g, ""));
                const paragraphNode = $createParagraphNode();
                paragraphNode.append(textNode);
                $insertNodes([paragraphNode]);
              }
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
      INSERT_AI_ASSISTANT_COMMAND,
      () => {
        // Check if text is selected
        editor.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            // Text is selected
            const text = selection.getTextContent();
            setSelectedText(text);
            setHasSelection(true);

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
          } else {
            // No text selection, reset all selection-related state
            setSelectedText("");
            setSurroundingText("");
            setSelectionInfo(null);
            setHasSelection(false);
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
    <div style={styles.container as React.CSSProperties} className="ai-popup-container">
      {hasSelection && (
        <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
          <strong>Selected text:</strong>{" "}
          {selectedText.length > 50 ? `${selectedText.substring(0, 50)}...` : selectedText}
        </div>
      )}
      {!hasSelection && (
        <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
          <strong>Create new content:</strong> Content will be added at cursor position
        </div>
      )}

      <div style={styles.contextInfo as React.CSSProperties}>
        <strong>Context used:</strong>
        <div>Title: {title ? (title.length > 30 ? `${title.substring(0, 30)}...` : title) : "Not available"}</div>
        <div>
          Description:{" "}
          {description
            ? description.length > 30
              ? `${description.substring(0, 30)}...`
              : description
            : "Not available"}
        </div>
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
          {isLoading ? "Generating..." : "Generate content"}
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
    </div>
  );
};
