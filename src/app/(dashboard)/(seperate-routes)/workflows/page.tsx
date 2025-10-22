import { requireAuth } from "@/lib/auth-utils"

const WorkFlowPage = async () => {
  await requireAuth()
  return (
    <div>
      Workflows
    </div>
  )
}

export default WorkFlowPage
