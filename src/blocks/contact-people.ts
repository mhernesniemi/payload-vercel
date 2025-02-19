import { Block } from "payload";

export const contactsBlock: Block = {
  slug: "contacts",
  fields: [
    {
      name: "contacts",
      type: "relationship",
      relationTo: "contacts",
      hasMany: true,
      required: true,
    },
  ],
  interfaceName: "ContactsBlock",
};
