import { ContactsBlock as ContactsBlockType } from "@/payload-types";

type Props = {
  block: ContactsBlockType;
};

export const ContactsBlock: React.FC<Props> = ({ block }) => {
  return (
    <div className="my-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {block.contacts?.map(
          (contact) =>
            typeof contact === "object" && (
              <div
                key={contact.id}
                className="rounded-xl bg-stone-900 p-6 shadow-xl ring-1 ring-stone-800 transition-all hover:ring-stone-700"
              >
                <h3 className="mb-3 text-xl font-semibold text-stone-100">{contact.id}</h3>
                <p className="text-stone-300">{contact.email}</p>
              </div>
            ),
        )}
      </div>
    </div>
  );
};
