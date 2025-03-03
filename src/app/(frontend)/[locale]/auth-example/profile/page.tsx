import configPromise from "@payload-config";
import { getServerSession } from "next-auth";
import { getPayload } from "payload";

export default async function ProfilePage() {
  const session = await getServerSession();

  const payload = await getPayload({
    config: configPromise,
  });

  const { docs } = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: session?.user?.email,
      },
    },
  });

  const user = docs[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-xl font-semibold">User Information</h2>
          <div>
            <span className="font-medium">Email:</span> {user?.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> {user?.role}
          </div>
        </div>
      </div>
    </div>
  );
}
