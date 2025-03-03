import { createServerFeature } from "@payloadcms/richtext-lexical";

export const AIRichTextFeature = createServerFeature({
  feature: {
    i18n: {
      en: {
        label: "AI Assistant",
      },
    },
    ClientFeature:
      "src/features/lexical/ai-richtext-feature/feature.client#AIRichTextClientFeature",
  },
  key: "aiRichTextFeature",
});
