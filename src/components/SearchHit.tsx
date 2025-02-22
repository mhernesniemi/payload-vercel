import { Link } from "@/i18n/routing";
import { useInstantSearch } from "react-instantsearch";

interface Hit {
  title: string;
  slug: string;
}

export default function SearchHit({ hit }: { hit: Hit }) {
  const { status } = useInstantSearch();

  console.log("status", status);

  if (status === "loading") {
    return;
  }

  if (status !== "idle") {
    return;
  }

  return (
    <Link href={`/articles/${hit.slug}`} className="block">
      <div className="mb-4 rounded-lg bg-stone-800 p-4">
        <h2 className="text-xl font-bold">{hit.title}</h2>
        <div className="mt-4 text-sm">Slug: {hit.slug}</div>
      </div>
    </Link>
  );
}
