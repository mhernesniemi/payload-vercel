import { Block } from "payload";

export const contactPeopleBlock: Block = {
  slug: "contactPeople",
  fields: [
    {
      name: "contacts",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      required: true,
    },
  ],
  interfaceName: "ContactPeopleBlock",
};
