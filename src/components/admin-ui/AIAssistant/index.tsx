"use client";

import { useState, useRef } from "react";
import { useField } from "@payloadcms/ui";
import { generateAdminContent } from "./actions";

interface FieldProps {
  appliedTo: string;
}

const Field: React.FC<FieldProps> = ({ appliedTo }) => {
  const { value: title } = useField<string>({
    path: "title",
  });
  const { value: description } = useField<string>({
    path: "description",
  });
  const { value, setValue } = useField<string>({
    path: appliedTo,
  });
  const [prompt, setPrompt] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalText, setOriginalText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateContent = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await generateAdminContent(prompt, title || "", description || "", value || "", appliedTo);

      if (response) {
        const cleanedResponse = response.replace(/^"|"$/g, "");
        setValue(cleanedResponse);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <button
        onClick={(e) => {
          e.preventDefault();
          if (!isFormVisible) {
            setOriginalText(value || "");
          }
          setIsFormVisible(!isFormVisible);
        }}
        className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
        style={{
          marginBottom: "0",
          marginTop: "0",
        }}
      >
        AI assistant
        {isFormVisible && (
          <span
            style={{
              marginLeft: "8px",
            }}
          >
            ✕
          </span>
        )}
      </button>

      {isFormVisible && (
        <div
          className="field-type textarea"
          style={{
            padding: "0 20px",
          }}
        >
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here..."
            style={{
              width: "100%",
              minHeight: "50px",
              padding: "10px",
              marginTop: "20px",
            }}
            autoFocus
          />
          <div>
            <button
              onClick={handleGenerateContent}
              className="btn save-draft btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-secondary btn--withoutPopup"
              style={{
                marginTop: "12px",
                marginBottom: "10px",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate content"}
            </button>
            {value && value !== originalText && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setValue(originalText);
                  setPrompt("");
                  textareaRef.current?.focus();
                }}
                className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-secondary btn--withoutPopup"
                style={{
                  marginTop: "12px",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
              >
                Restore original
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Field;
