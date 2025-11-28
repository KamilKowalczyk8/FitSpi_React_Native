import { UserProfileController } from '@/controllers/diet/user.profile.controller'; // Dostosuj ścieżkę
import { useAuth } from '@/hooks/useAuth';
import { ActivityLevel, DietGoal, Gender, UserProfileData } from '@/models/Profile'; // Dostosuj ścieżkę
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useUserProfileForm = (visible: boolean, onSuccess: () => void) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [activity, setActivity] = useState<ActivityLevel>(ActivityLevel.SEDENTARY);
  const [goal, setGoal] = useState<DietGoal>(DietGoal.MAINTAIN);

  useEffect(() => {
    if (visible && token) {
      loadProfile();
    }
  }, [visible, token]);

  const loadProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const profile = await UserProfileController.getProfile(token);
      if (profile) {
        setIsEditing(true);
        setWeight(profile.weight_kg.toString());
        setHeight(profile.height_cm.toString());
        setBirthDate(profile.date_of_birth);
        setGender(profile.gender);
        setActivity(Number(profile.activity_level));
        setGoal(profile.goal);
      } else {
        setIsEditing(false);
        setWeight('');
        setHeight('');
        setBirthDate('');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Nie udało się pobrać profilu');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!token) return;

    if (!weight || !height || !birthDate) {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      Alert.alert('Błąd', 'Data musi być w formacie RRRR-MM-DD');
      return;
    }

    const payload: UserProfileData = {
      weight_kg: parseFloat(weight),
      height_cm: parseFloat(height),
      date_of_birth: birthDate,
      gender,
      activity_level: activity,
      goal,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await UserProfileController.updateProfile(token, payload);
        Alert.alert('Sukces', 'Profil zaktualizowany!');
      } else {
        await UserProfileController.createProfile(token, payload);
        Alert.alert('Sukces', 'Profil utworzony!');
      }
      onSuccess(); 
    } catch (error: any) {
      Alert.alert('Błąd', error.message || 'Wystąpił błąd zapisu');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isEditing,

    values: { weight, height, birthDate, gender, activity, goal },
    setters: { setWeight, setHeight, setBirthDate, setGender, setActivity, setGoal },
    saveProfile,
  };
};