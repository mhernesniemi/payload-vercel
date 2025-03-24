export const elasticMappings = {
  settings: {
    analysis: {
      analyzer: {
        default: {
          type: "finnish",
        },
      },
    },
  },
  mappings: {
    properties: {
      title: {
        type: "text",
        analyzer: "finnish",
        fields: {
          keyword: { type: "keyword" },
        },
      },
      content: {
        type: "text",
        analyzer: "finnish",
      },
      slug: { type: "keyword" },
      publishedDate: { type: "date" },
      createdAt: { type: "date" },
      categories: {
        type: "keyword",
        fields: {
          keyword: { type: "keyword" },
        },
      },
      collection: { type: "keyword" },
      locale: { type: "keyword" },
    },
  },
} as const;
