import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/zodSchemas';
import { router } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';

export function useLoginController() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    try {
      
      loginSchema.parse({ email, password, rememberMe });

      const success = await login(email, password, rememberMe);
      if (success) {
       router.replace('/(tabs)/workout');

      } else {
        alert('Błędny email lub hasło');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { email?: string; password?: string } = {};
        for (const issue of error.issues) {
          if (issue.path.includes('email')) newErrors.email = issue.message;
          if (issue.path.includes('password')) newErrors.password = issue.message;
        }
        setErrors(newErrors);
      } else {
        alert('Wystąpił nieoczekiwany błąd');
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    handleLogin,
  };
}
