import { Alert } from 'react-native';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface InvitationResponse {
  id: number; 
  status: string;
  createdAt: string;
  trainer: ClientResponse; 
}

export interface ClientResponse {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}

export const ClientLinkController = {
  getMyClients: async (token: string): Promise<ClientResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/client-links/my-clients`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się pobrać listy klientów');
      }
      return data as ClientResponse[];
    } catch (error: any) {
      console.error('Błąd w getMyClients:', error);
      Alert.alert('Błąd', error.message || 'Wystąpił błąd sieciowy.');
      return []; 
    }
  },


  sendInvitation: async (token: string, email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/client-links/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clientEmail: email }), 
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się wysłać zaproszenia');
      }
      
      Alert.alert('Sukces', data.message || 'Zaproszenie zostało wysłane!');
      return true;
    } catch (error: any) {
      console.error('Błąd w sendInvitation:', error);
      Alert.alert('Błąd', error.message || 'Wystąpił błąd sieciowy.');
      return false;
    }
  },


  getPendingInvitations: async (token: string): Promise<InvitationResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/client-links/pending`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się pobrać zaproszeń');
      }
      return data as InvitationResponse[];
    } catch (error: any) {
      console.error('Błąd w getPendingInvitations:', error);
      Alert.alert('Błąd', error.message);
      return [];
    }
  },


  respondToInvitation: async (
    token: string,
    linkId: number,
    accept: boolean,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/client-links/${linkId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept: accept }), 
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się odpowiedzieć na zaproszenie');
      }
      
      Alert.alert('Sukces', data.message);
      return true;
    } catch (error: any) {
      console.error('Błąd w respondToInvitation:', error);
      Alert.alert('Błąd', error.message);
      return false;
    }
  },

 
  deleteClient: async (token: string, clientId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/client-links/my-clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się usunąć podopiecznego');
      }

      Alert.alert('Sukces', data.message || 'Podopieczny został usunięty.');
      return true;
    } catch (error: any) {
      console.error('Błąd w deleteClient:', error);
      Alert.alert('Błąd', error.message);
      return false;
    }
  },
};