import { ClientLinkController, ClientResponse } from '@/controllers/coach/clientLink.controller';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useCoachController() {
  const { token } = useAuth();
  
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBrowseModalVisible, setBrowseModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const openCreateWorkoutModal = () => setCreateModalVisible(true);
  const closeCreateWorkoutModal = () => setCreateModalVisible(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const fetchClients = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await ClientLinkController.getMyClients(token);
      setClients(data);
    } catch (e: any) {
      setError(e.message || 'Wystąpił błąd');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [fetchClients])
  );

  const openBrowseModal = (client: ClientResponse) => {
    setSelectedClient(client);
    setBrowseModalVisible(true);
  };

  const closeBrowseModal = () => {
    setSelectedClient(null);
    setBrowseModalVisible(false);
  };

  return {
    clients,
    isLoading,
    error,
    isModalVisible,
    openModal,
    closeModal,
    fetchClients,
    
    selectedClient,
    isBrowseModalVisible,
    openBrowseModal,
    closeBrowseModal,

    isCreateModalVisible,
    openCreateWorkoutModal,
    closeCreateWorkoutModal,
  };
}