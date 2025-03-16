import { Block } from "payload";

export const videoEmbedBlock: Block = {
  slug: "videoEmbed",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "youtubeId",
      type: "text",
      required: true,
    },
  ],
  interfaceName: "VideoEmbedBlock",
};
