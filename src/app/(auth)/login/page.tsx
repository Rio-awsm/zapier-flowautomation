import LoginForm from "@/features/auth/components/loginform"
import { requireUnauth } from "@/lib/auth-utils"

const LoginPage = async () => {
  await requireUnauth()
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
