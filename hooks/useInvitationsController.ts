import { ClientLinkController, InvitationResponse } from '@/controllers/coach/clientLink.controller';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';

export function useInvitationsController(isVisible: boolean) { 
  const { token } = useAuth();
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await ClientLinkController.getPendingInvitations(token);
      setInvitations(data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isVisible) {
      fetchInvitations();
    }
  }, [isVisible, fetchInvitations]); 

  const handleRespond = async (linkId: number, accept: boolean) => {
    if (!token) return;
    
    setIsLoading(true); 
    const success = await ClientLinkController.respondToInvitation(token, linkId, accept);
    setIsLoading(false);

    if (success) {
      setInvitations(prev => prev.filter(inv => inv.id !== linkId));
    }
  };

  return {
    invitations,
    isLoading,
    handleRespond,
  };
}