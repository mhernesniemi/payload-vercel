import { UserIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function UserAuthNav() {
  const payload = await getPayload({
    config: configPromise,
  });

  const session = await payload.auth({
    headers: await headers(),
  });

  const user = session?.user;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/auth-example/create-article"
          className="group flex items-center gap-2 text-xs font-medium uppercase"
        >
          <UserIcon className="h-5 w-5 group-hover:text-amber-500" />
          <span className="hidden xl:block">Profile</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth-example/login"
        className="group flex items-center gap-2 text-xs font-medium uppercase"
      >
        <UserIcon className="h-5 w-5 group-hover:text-amber-500" />
        <span className="hidden xl:block">Login</span>
      </Link>
    </div>
  );
}
