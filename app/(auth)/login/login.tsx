import { LoginView } from '@/components/auth/login.view';
import { useLoginController } from '@/controllers/auth/login.controller';
export default function LoginScreen() {
  const controller = useLoginController();
  return <LoginView {...controller} />;
}
