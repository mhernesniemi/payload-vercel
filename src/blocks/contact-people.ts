import { Block } from "payload";

export const contactsBlock: Block = {
  slug: "contacts",
  fields: [
    {
      name: "contacts",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      required: true,
    },
  ],
  interfaceName: "ContactsBlock",
};
