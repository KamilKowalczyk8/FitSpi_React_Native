# FitSpi (Frontend) - Aplikacja Mobilna React Native

**FitSpi** to warstwa kliencka (frontend) kompleksowego systemu fitness, stworzona w technologii **React Native** przy użyciu platformy **Expo**. Aplikacja służy do zarządzania treningiem siłowym, monitorowania diety oraz umożliwia zdalną współpracę na linii trener-podopieczny.

Projekt stanowi część pracy inżynierskiej zrealizowanej na kierunku Informatyka (Uniwersytet Dolnośląski DSW).

> **Uwaga:** To repozytorium zawiera kod źródłowy aplikacji mobilnej. Kod serwera (Backend) znajduje się w osobnym repozytorium: https://github.com/KamilKowalczyk8/FitSpi_Backend_NestJs

## Kluczowe Funkcjonalności

Aplikacja typu "all-in-one" integrująca narzędzia dla osób trenujących i trenerów:

### Dla Użytkownika
* **Planer Treningowy:** Tworzenie, edycja i kopiowanie planów treningowych, baza ćwiczeń, rejestracja serii i obciążeń.
* **Dziennik Żywieniowy:** Monitorowanie kalorii i makroskładników, dodawanie posiłków (śniadanie, obiad, etc.), baza produktów.
* **Profil Biometryczny:** Automatyczne wyliczanie zapotrzebowania (BMR/CPM) na podstawie wagi, wzrostu i aktywności.
* **Współpraca:** Odbieranie planów treningowych wysłanych przez trenera.

### Dla Trenera
* **Panel Trenera:** Zarządzanie listą podopiecznych.
* **Kreator Planów:** Tworzenie dedykowanych treningów i wysyłanie ich do klientów (statusy: Szkic -> Wysłany).
* **Zaproszenia:** System zapraszania podopiecznych via e-mail.

##  Stack Technologiczny

Aplikacja została zbudowana w oparciu o nowoczesny ekosystem React Native:

* **Framework:** React Native + Expo.
* **Język:** TypeScript (Statyczne typowanie dla zwiększenia niezawodności).
* **Nawigacja:** **Expo Router v2** (File-based routing) – routing oparty na strukturze plików, inspirowany Next.js.
* **Komunikacja z API:** Natywne **Fetch API** (zamiast zewnętrznych bibliotek jak Axios) dla optymalizacji rozmiaru aplikacji.
* **UI/UX:** Ciemny motyw (Dark Mode) dla oszczędności energii i ergonomii.

##  Architektura Projektu (MVVM)

Aby uniknąć "spaghetti code" i zapewnić skalowalność, w projekcie wdrożono adaptację wzorca **MVVM (Model-View-ViewModel)**:

1.  **View (Warstwa Prezentacji):**
    * Katalog `components/`. Pasywne komponenty React renderujące interfejs na podstawie otrzymanych propsów. Nie zawierają logiki biznesowej.
2.  **ViewModel (Warstwa Logiki - Custom Hooks):**
    * Katalog `hooks/` (np. `useCoachController`, `useDiet`). Pośredniczą między widokiem a modelem. Zarządzają stanem (`useState`), cyklem życia (`useEffect`) i obsługą błędów.
3.  **Model (Warstwa Danych):**
    * Katalog `controllers/`. Obiekty odpowiedzialne wyłącznie za komunikację z REST API. Przyjmują dane i token, wysyłają żądanie i zwracają odpowiedź.

### Struktura Katalogów

Struktura oparta o Expo Router:

```text
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
```

### Instalacja i Uruchomienie

## Wymagania
- Node.js (LTS)
- Aplikacja Expo Go na telefonie (Android/iOS) lub Emulator.

## Krok 1: Klonowanie i instalacja

git clone - https://github.com/KamilKowalczyk8/FitSpi_React_Native
cd FitSpiReact
npm install

## Krok 2: Konfiguracja zmiennych środowiskowych
Utwórz plik .env w głównym katalogu i podaj adres API backendu:
EXPO_PUBLIC_API_URL=http://twoj-adres-ip:4000/api

## Krok 3: Uruchomienie

npx expo start


### Zrzuty Ekranu

## 📸 Zrzuty Ekranu

| Logowanie |
|:---:|
<img width="557" height="604" alt="Image" src="https://github.com/user-attachments/assets/5030dd0a-810f-4ead-b9ae-e3b2791856c9" />




| Panel Trenera |
|:---:|
<img width="1168" height="504" alt="Image" src="https://github.com/user-attachments/assets/c8cf255d-24f7-46bd-ac06-8113c465767b" />




| Dziennik Diety |
|:---:|
<img width="1423" height="768" alt="Image" src="https://github.com/user-attachments/assets/009677fe-56b6-4fa1-8369-3a73fd95f9f0" />




| Trening |
|:---:|
<img width="1258" height="545" alt="Image" src="https://github.com/user-attachments/assets/720dd38b-008e-46e4-abab-53e23e9b78d5" />
