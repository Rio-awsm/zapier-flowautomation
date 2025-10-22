import { requireAuth } from "@/lib/auth-utils"

const CredentialPage = async () => {
   await requireAuth()
  return (
    <div>
      credentials
    </div>
  )
}

export default CredentialPage
