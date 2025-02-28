import { createServerFeature } from "@payloadcms/richtext-lexical";

export const TestFeature = createServerFeature({
  feature: {
    i18n: {
      en: {
        label: "Test Feature",
      },
    },
    ClientFeature: "./feature.client#TestClientFeature",
  },
  key: "testFeature",
});
