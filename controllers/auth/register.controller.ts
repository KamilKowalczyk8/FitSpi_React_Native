import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/zodSchemas';
import { router } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';

export function useRegisterController() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async () => {
    try {
      registerSchema.parse({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      const success = await register({
        first_name: firstName,
        last_name: lastName,
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
          if (issue.path.includes('firstName')) newErrors.firstName = issue.message;
          if (issue.path.includes('lastName')) newErrors.lastName = issue.message;
          if (issue.path.includes('email')) newErrors.email = issue.message;
          if (issue.path.includes('password')) newErrors.password = issue.message;
          if (issue.path.includes('confirmPassword')) newErrors.confirmPassword = issue.message;
        }
        setErrors(newErrors);
      } else {
        alert('Wystąpił nieoczekiwany błąd');
      }
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
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
