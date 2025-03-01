"use client";

import { useState, useRef } from "react";
import { useField, useDocumentInfo } from "@payloadcms/ui";
import { generateImageAltText } from "./actions";

interface FieldProps {
  path: string;
}

const Field: React.FC<FieldProps> = ({ path }) => {
  const { value, setValue } = useField<string>({
    path,
  });
  const { id: documentId } = useDocumentInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [originalText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateContent = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const imageId = documentId ? String(documentId) : undefined;
      const response = await generateImageAltText(imageId);

      if (response) {
        const cleanedResponse = response.replace(/^"|"$/g, "");
        setValue(cleanedResponse);
      }
    } catch (error) {
      console.error("Error generating alt text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-container">
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
          {isLoading ? "Generating..." : "Generate alt text"}
        </button>
        {value && value !== originalText && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setValue(originalText);
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
  );
};

export default Field;
