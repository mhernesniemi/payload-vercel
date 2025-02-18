import { Link } from "@/i18n/routing";

interface SearchHitType {
  slug: string;
  title: string;
  _snippetResult?: {
    content?: {
      value: string;
    };
  };
}

export default function SearchHit({ hit }: { hit: SearchHitType }) {
  return (
    <Link href={`/${hit.slug}`} className="block rounded-lg p-3 hover:bg-gray-50">
      <h3 className="font-medium text-gray-900">{hit.title}</h3>
      {hit._snippetResult?.content?.value && (
        <p className="mt-1 text-sm text-gray-600">{hit._snippetResult.content.value}...</p>
      )}
    </Link>
  );
}
