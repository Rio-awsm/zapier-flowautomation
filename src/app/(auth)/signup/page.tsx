import RegisterForm from "@/features/auth/components/registerform"
import { requireUnauth } from "@/lib/auth-utils"

const RegisterPage = async () => {
  await requireUnauth()
  return (
    <div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
