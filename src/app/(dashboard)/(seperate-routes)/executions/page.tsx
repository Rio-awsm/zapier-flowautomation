import { requireAuth } from "@/lib/auth-utils"

const ExecutionsPage = async () => {
   await requireAuth()
  return (
    <div>
      Executions
    </div>
  )
}

export default ExecutionsPage
