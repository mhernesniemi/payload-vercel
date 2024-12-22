import { Block } from "payload";

export const videoEmbedBlock: Block = {
  slug: "videoEmbed",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "youtubeId",
      type: "text",
      required: true,
    },
  ],
  interfaceName: "VideoEmbedBlock",
};
