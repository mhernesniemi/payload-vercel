import { Link } from "@/i18n/routing";
import { useInstantSearch } from "react-instantsearch";
import Heading from "./Heading";
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
    <Link href={`/articles/${hit.slug}`} className="mb-4 block">
      <div className="rounded-lg bg-stone-800 p-4">
        <Heading level="h2" size="sm" className="font-bold">
          {hit.title}
        </Heading>
        <div className="mt-4 text-sm">Slug: {hit.slug}</div>
      </div>
    </Link>
  );
}
