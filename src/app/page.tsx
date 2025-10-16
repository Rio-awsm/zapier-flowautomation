import Logout from "@/components/logout";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth()
  const data = await caller.getUsers()
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center gap-y-6">
      protected homepage
      <div>{JSON.stringify(data, null, 2)}</div>
      <div><Logout /></div>
    </div>
  );
};

export default Page;
