import { RegisterView } from '@/components/auth/register.view';
import { useRegisterController } from './register.controller';

export default function RegisterScreen() {
  const controller = useRegisterController();
  return <RegisterView {...controller} />;
}
