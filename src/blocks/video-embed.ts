import { Block } from "payload";

export const videoEmbedBlock: Block = {
  slug: "videoEmbed",
  fields: [
    {
      name: "youtubeId",
      type: "text",
      required: true,
    },
    {
      name: "alt",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "This will be displayed as a caption for the video",
      },
    },
  ],
  interfaceName: "VideoEmbedBlock",
};
