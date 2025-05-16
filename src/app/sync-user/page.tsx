import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, permanentRedirect, redirect } from "next/navigation";

const SyncUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not Found");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userEmailAddress = user.emailAddresses[0]?.emailAddress;

  if (!userEmailAddress) {
    return notFound();
  }

  const userData = {
    where: {
      emailAddress: userEmailAddress ?? "",
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
    },
    create: {
      id: userId,
      emailAddress: userEmailAddress ?? "",
      imageUrl: user.imageUrl,
      firstName: user.firstName,
    },
  };

  await db.user.upsert(userData);

  redirect("/dashboard");
};

export default SyncUser;
