FitSpi (Frontend) - Aplikacja Mobilna React Native
FitSpi to warstwa kliencka (frontend) kompleksowego systemu fitness, stworzona w technologii React Native przy użyciu platformy Expo. Aplikacja służy do zarządzania treningiem siłowym, monitorowania diety oraz umożliwia zdalną współpracę na linii trener-podopieczny.
+3

Projekt stanowi część pracy inżynierskiej zrealizowanej na kierunku Informatyka (Uniwersytet Dolnośląski DSW).
+1

Uwaga: To repozytorium zawiera kod źródłowy aplikacji mobilnej. Kod serwera (Backend) znajduje się w osobnym repozytorium: [Link do Backend]

📱 Kluczowe Funkcjonalności
Aplikacja typu "all-in-one" integrująca narzędzia dla osób trenujących i trenerów:

Dla Użytkownika

Planer Treningowy: Tworzenie, edycja i kopiowanie planów treningowych, baza ćwiczeń, rejestracja serii i obciążeń.
+2


Dziennik Żywieniowy: Monitorowanie kalorii i makroskładników, dodawanie posiłków (śniadanie, obiad, etc.), baza produktów.
+1


Profil Biometryczny: Automatyczne wyliczanie zapotrzebowania (BMR/CPM) na podstawie wagi, wzrostu i aktywności.
+1


Współpraca: Odbieranie planów treningowych wysłanych przez trenera.

Dla Trenera

Panel Trenera: Zarządzanie listą podopiecznych.
+1


Kreator Planów: Tworzenie dedykowanych treningów i wysyłanie ich do klientów (statusy: Szkic -> Wysłany).
+1


Zaproszenia: System zapraszania podopiecznych via e-mail.

🛠️ Stack Technologiczny
Aplikacja została zbudowana w oparciu o nowoczesny ekosystem React Native:


Framework: React Native + Expo.
+1


Język: TypeScript (Statyczne typowanie dla zwiększenia niezawodności).
+1


Nawigacja: Expo Router v2 (File-based routing) – routing oparty na strukturze plików, inspirowany Next.js.
+1


Komunikacja z API: Natywne Fetch API (zamiast zewnętrznych bibliotek jak Axios) dla optymalizacji rozmiaru aplikacji.
+1


UI/UX: Ciemny motyw (Dark Mode) dla oszczędności energii i ergonomii.

🏗️ Architektura Projektu (MVVM)
Aby uniknąć "spaghetti code" i zapewnić skalowalność, w projekcie wdrożono adaptację wzorca MVVM (Model-View-ViewModel):
+1

View (Warstwa Prezentacji):

Katalog components/. Pasywne komponenty React renderujące interfejs na podstawie otrzymanych propsów. Nie zawierają logiki biznesowej.

ViewModel (Warstwa Logiki - Custom Hooks):

Katalog hooks/ (np. useCoachController, useDiet). Pośredniczą między widokiem a modelem. Zarządzają stanem (useState), cyklem życia (useEffect) i obsługą błędów.
+1

Model (Warstwa Danych):

Katalog controllers/. Obiekty odpowiedzialne wyłącznie za komunikację z REST API. Przyjmują dane i token, wysyłają żądanie i zwracają odpowiedź.
+1

Struktura Katalogów
Struktura oparta o Expo Router:

Plaintext
/app
  ├── (auth)          # Ekrany publiczne (Logowanie, Rejestracja) - Stack Navigator
  ├── (tabs)          # Ekrany chronione (Trening, Dieta, Trener) - Bottom Tabs
  │     ├── coach     # Moduł trenera
  │     ├── diet      # Moduł diety
  │     └── workout   # Moduł treningowy
  ├── _layout.tsx     # Główny Layout i ochrona tras (Auth Guard)
/src
  ├── components      # Komponenty UI (View)
  ├── hooks           # Logika biznesowa (ViewModel)
  ├── controllers     # Logika zapytań API (Model)
  ├── models          # Interfejsy TypeScript
  └── constants       # Stałe (np. kolory motywu)
⚙️ Instalacja i Uruchomienie
Wymagania
Node.js (LTS)

Aplikacja Expo Go na telefonie (Android/iOS) lub Emulator.

Krok 1: Klonowanie i instalacja
Bash
git clone https://github.com/TwojLogin/FitSpi-Frontend.git
cd FitSpi-Frontend
npm install
Krok 2: Konfiguracja zmiennych środowiskowych
Utwórz plik .env w głównym katalogu i podaj adres API backendu:

Fragment kodu
EXPO_PUBLIC_API_URL=http://twoj-adres-ip:4000/api
Krok 3: Uruchomienie
Bash
npx expo start
Zeskanuj kod QR aplikacją Expo Go lub naciśnij a (Android) / i (iOS) w terminalu, aby uruchomić na emulatorze.
