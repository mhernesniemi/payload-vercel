"use client";

import { useState } from "react";
import OpenAI from "openai";
import { useField } from "@payloadcms/ui";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Field: React.FC = () => {
  const [aiResponse, setAiResponse] = useState("");
  const { value, setValue } = useField<string>({ path: "title" });
  const [prompt, setPrompt] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleGenerateContent = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!value) return;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `This is the prompt: "${prompt}"\n\n Apply it to the following text, give response so it can be used directly in the text field where it came from: "${value}"`,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const cleanedResponse = response.replace(/^"|"$/g, "");
        setAiResponse(cleanedResponse);
        setValue(cleanedResponse);
        console.log("AI Response:", cleanedResponse);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div className="ai-container">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFormVisible(!isFormVisible);
        }}
        className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
        style={{ marginBottom: "0", marginTop: "0" }}
      >
        AI assistant
        {isFormVisible && <span style={{ marginLeft: "8px" }}>✕</span>}
      </button>

      {isFormVisible && (
        <>
          <div className="field-type textarea" style={{ padding: "0 20px" }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt here..."
              style={{
                width: "100%",
                minHeight: "50px",
                padding: "10px",
                marginTop: "20px",
              }}
            />
            <div>
              <button
                onClick={handleGenerateContent}
                className="btn save-draft btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-secondary btn--withoutPopup"
                style={{ marginTop: "12px", marginBottom: "10px" }}
              >
                Generate content
              </button>
            </div>
          </div>
        </>
      )}
      {aiResponse && (
        <div style={{ marginTop: "20px" }}>
          <h3>AI:n vastaus:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{aiResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default Field;
