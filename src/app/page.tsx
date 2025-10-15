import { caller } from "@/trpc/server"


const Page = async () => {
  const user = await caller.getUsers()
  return (
    <div>
      {JSON.stringify(user)}
    </div>
  )
}

export default Page

