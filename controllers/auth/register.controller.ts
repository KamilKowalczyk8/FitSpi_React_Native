import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/zodSchemas';
import { router } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';

export function useRegisterController() {
  const { register } = useAuth();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async () => {
    try {
      registerSchema.parse({
        first_name,
        last_name,
        email,
        password,
        confirmPassword,
      });

      const success = await register({
        first_name,
        last_name,
        email,
        password,
        confirmPassword,
      });

      if (success) {
        router.replace('/(tabs)/workout');
      } else {
        alert('Rejestracja nie powiodła się');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        for (const issue of error.issues) {
          if (issue.path.includes('first_name'))
            newErrors.first_name = issue.message;
          if (issue.path.includes('last_name'))
            newErrors.last_name = issue.message;
          if (issue.path.includes('email')) newErrors.email = issue.message;
          if (issue.path.includes('password'))
            newErrors.password = issue.message;
          if (issue.path.includes('confirmPassword'))
            newErrors.confirmPassword = issue.message;
        }
        setErrors(newErrors);
      } else {
        alert('Wystąpił nieoczekiwany błąd');
      }
    }
  };

  return {
    first_name,
    setFirstName,
    last_name,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    handleRegister,
  };
}
