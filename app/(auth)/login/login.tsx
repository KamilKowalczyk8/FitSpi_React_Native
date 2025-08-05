import { LoginView } from '@/components/auth/login.view';
import { useLoginController } from './login.controller';

export default function LoginScreen() {
  const controller = useLoginController();
  return <LoginView {...controller} />;
}
