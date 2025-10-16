import LoginForm from "@/features/auth/components/loginform";
import { requireUnauth } from "@/lib/auth-utils";

const LoginPage = async () => {
  await requireUnauth();
  return (
    <LoginForm />
  );
};

export default LoginPage;
