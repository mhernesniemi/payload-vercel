import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getServerSession } from "next-auth";

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
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
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
