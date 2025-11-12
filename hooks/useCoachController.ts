import { ClientLinkController, ClientResponse } from '@/controllers/coach/clientLink.controller';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useCoachController() {
  const { token } = useAuth();

  // Stan dla modalu zapraszania
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Stan dla listy klientów
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NOWY STAN DLA MODALA PRZEGLĄDANIA ---
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  const [isBrowseModalVisible, setBrowseModalVisible] = useState(false);
  // --- KONIEC NOWEGO STANU ---

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

  // --- NOWE FUNKCJE OBSŁUGI ---
  const openBrowseModal = (client: ClientResponse) => {
    setSelectedClient(client);
    setBrowseModalVisible(true);
  };

  const closeBrowseModal = () => {
    setSelectedClient(null);
    setBrowseModalVisible(false);
  };
  // --- KONIEC NOWYCH FUNKCJI ---

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
  };
}