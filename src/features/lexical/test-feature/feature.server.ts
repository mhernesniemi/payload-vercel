import { createServerFeature } from "@payloadcms/richtext-lexical";

export const TestFeature = createServerFeature({
  feature: {
    i18n: {
      en: {
        label: "AI Assistant",
      },
    },
    ClientFeature: "src/features/lexical/test-feature/feature.client#TestClientFeature",
  },
  key: "testFeature",
});
