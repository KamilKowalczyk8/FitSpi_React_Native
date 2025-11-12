import { ClientLinkController } from '@/controllers/coach/clientLink.controller';
import { useAuth } from '@/hooks/useAuth';
import { addClientSchema } from '@/lib/zodSchemas';
import { useState } from 'react';
import { z } from 'zod';

interface Props {
  onClose: () => void;
  onInvitationSent: () => void;
}

export function useAddClientController({ onClose, onInvitationSent }: Props) {
  const { token } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleClose = () => {
    setEmail('');
    setErrors({});
    onClose();
  };

  const handleSendInvitation = async () => {
    try {
      addClientSchema.parse({ email });
      setErrors({}); 
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        for (const issue of error.issues) {
          if (issue.path.includes('email')) newErrors.email = issue.message;
        }
        setErrors(newErrors);
      }
      return; 
    }

 
    if (!token) return;
    setIsLoading(true);
    try {
      const success = await ClientLinkController.sendInvitation(token, email);
      if (success) {
        onInvitationSent(); 
        handleClose();      
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    errors,
    handleSendInvitation,
    handleClose,
  };
}