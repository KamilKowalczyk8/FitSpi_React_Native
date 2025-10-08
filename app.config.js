import path from 'path';

// ❗️ KLUCZOWY KROK: Ustawiamy zmienną środowiskową, zanim Expo wczyta resztę.
// To jest linia, która bezpośrednio naprawia błąd "First argument of 'require.context' should be a string".
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

export default {
  expo: {
    name: "FitSpiReact",
    slug: "fitspireact",
    version: "1.0.0", // Pamiętaj o dodaniu reszty pól konfiguracyjnych

    // Przykład innych ważnych pól (dostosuj do swojego projektu)
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    // Koniec przykładowych pól

    plugins: [
      // Twoja konfiguracja jest w porządku, ale dodanie zmiennej powyżej
      // daje 100% pewności, że ścieżka zostanie ustawiona poprawnie.
      [
        "expo-router",
        {
          root: "app",
        },
      ],
    ],
  },
};