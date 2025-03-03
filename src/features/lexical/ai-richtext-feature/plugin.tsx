"use client";

import type { PluginComponent } from "@payloadcms/richtext-lexical";
import type { LexicalCommand } from "@payloadcms/richtext-lexical/lexical";
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { useField } from "@payloadcms/ui";
import { useEffect, useRef, useState } from "react";
import { generateAdminContent } from "./actions";

export const INSERT_AI_ASSISTANT_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_AI_ASSISTANT_COMMAND",
);

export const TestPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [_surroundingText, setSurroundingText] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
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
      const response = await generateAdminContent(prompt, title, description, content, "content", {
        otherParagraphs:
          paragraphs.length > 0 ? paragraphs.filter((p) => p !== content) : undefined,
        pageTitle: title,
        pageDescription: description,
      });

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

              // Collect all editor paragraphs for context
              const allParagraphs: string[] = [];

              // Use Lexical's own method to get all paragraphs
              const rootElement = editor.getRootElement();

              if (rootElement) {
                // Get all DOM elements that are p-tags (paragraphs)
                const paragraphElements = rootElement.querySelectorAll("p");

                // Iterate through all found paragraph elements
                paragraphElements.forEach((element) => {
                  const text = element.textContent;
                  // Ensure the text exists and is not the selected text
                  if (text && text.trim() && text !== selectedText) {
                    allParagraphs.push(text);
                  }
                });
              }

              // If the above didn't yield any results, try again with Lexical's tree structure
              if (allParagraphs.length === 0) {
                const rootNode = $isRootOrShadowRoot(parentNode.getParent())
                  ? parentNode.getParent()
                  : parentNode.getTopLevelElement()?.getParent();

                if (rootNode) {
                  rootNode.getChildren().forEach((node) => {
                    const text = node.getTextContent();
                    if (text.trim() && text !== selectedText) {
                      allParagraphs.push(text);
                    }
                  });
                }
              }

              console.log("Collected paragraphs:", allParagraphs);
              setParagraphs(allParagraphs);
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

            // Even without selection, collect all paragraph texts for context
            try {
              const allParagraphs: string[] = [];
              const rootElement = editor.getRootElement();

              if (rootElement) {
                // Get all paragraph elements
                const paragraphElements = rootElement.querySelectorAll("p");

                paragraphElements.forEach((element) => {
                  const text = element.textContent;
                  if (text && text.trim()) {
                    allParagraphs.push(text);
                  }
                });

                console.log("Collected paragraphs (no selection):", allParagraphs);
                setParagraphs(allParagraphs);
              }
            } catch (error) {
              console.error("Error getting paragraphs without selection:", error);
              setParagraphs([]);
            }
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
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div>
          Title:{" "}
          {title ? (title.length > 30 ? `${title.substring(0, 30)}...` : title) : "Not available"}
        </div>
        <div>
          Description:{" "}
          {description
            ? description.length > 30
              ? `${description.substring(0, 30)}...`
              : description
            : "Not available"}
        </div>
        <div>
          Context paragraphs: {paragraphs.length}{" "}
          {paragraphs.length > 0 ? "paragraphs" : "paragraph"}
          {paragraphs.length > 0 && (
            <span className="paragraph-preview">
              {paragraphs.length > 2
                ? `(first: "${paragraphs[0].substring(0, 20)}...", last: "${paragraphs[paragraphs.length - 1].substring(0, 20)}...")`
                : paragraphs.length === 1
                  ? `"${paragraphs[0].substring(0, 30)}..."`
                  : `"${paragraphs[0].substring(0, 15)}...", "${paragraphs[1].substring(0, 15)}..."`}
            </span>
          )}
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
        <button
          onClick={handleGenerateContent}
          disabled={isLoading}
          style={styles.button as React.CSSProperties}
        >
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
