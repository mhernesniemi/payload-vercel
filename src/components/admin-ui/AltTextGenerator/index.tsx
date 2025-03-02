"use client";

import { useState } from "react";
import { useField, useDocumentInfo, useLocale } from "@payloadcms/ui";
import { translateAltText } from "./actions";

interface FieldProps {
  path: string;
}

const Field: React.FC<FieldProps> = ({ path }) => {
  const { value, setValue } = useField<string>({
    path,
  });
  const { id: documentId } = useDocumentInfo();
  const locale = useLocale();
  const [isTranslating, setIsTranslating] = useState(false);

  console.log("locale", locale);

  const handleTranslateContent = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsTranslating(true);
    try {
      const imageId = documentId ? String(documentId) : undefined;
      const response = await translateAltText(imageId, locale.code);

      if (response) {
        const cleanedResponse = response.replace(/^"|"$/g, "");
        setValue(cleanedResponse);
      }
    } catch (error) {
      console.error("Error translating alt text:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (value) return null;

  return (
    <div className="ai-container">
      <button
        onClick={handleTranslateContent}
        className="btn save-draft btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-secondary btn--withoutPopup"
        style={{
          marginTop: "12px",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
        disabled={isTranslating}
      >
        {isTranslating ? "Translating..." : "Translate alt text"}
      </button>
    </div>
  );
};

export default Field;
