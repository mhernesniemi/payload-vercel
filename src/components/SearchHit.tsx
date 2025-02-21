import { Link } from "@/i18n/routing";

interface Hit {
  title: string;
  slug: string;
}

export default function SearchHit({ hit }: { hit: Hit }) {
  return (
    <Link href={`/articles/${hit.slug}`}>
      <div className="mb-4 block rounded-lg bg-stone-800 p-4">
        <h2 className="text-xl font-bold">{hit.title}</h2>
        <div className="mt-4 text-sm">Slug: {hit.slug}</div>
      </div>
    </Link>
  );
}
