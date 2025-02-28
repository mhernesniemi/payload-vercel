import { createServerFeature } from "@payloadcms/richtext-lexical";

export const TestFeature = createServerFeature({
  feature: {
    i18n: {
      en: {
        label: "Test Feature",
      },
    },
    ClientFeature: "@/features/lexical/test-feature/feature.client#TestClientFeature",
  },
  key: "testFeature",
});
