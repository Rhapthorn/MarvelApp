[project_readme.md](https://github.com/user-attachments/files/33708708/project_readme.md)
# Marvel Cross-Platform Mobile Application

A modern, high-performance React Native application built for Marvel enthusiasts. This app interfaces directly with the Comic Vine API to deliver a rich, dark-mode-optimized database of Marvel characters, dynamic HTML biographies, and deep media archives.

## 🚀 Key Features

* **Strict Marvel Filtering:** Automatically filters the Comic Vine database to exclusively serve Marvel characters (Publisher ID `43`).

* **Debounced Live Search:** Features real-time, throttled searching that allows users to instantly find characters using partial-name queries without triggering API rate limits.

* **Optimized UI/UX (Dark Mode First):** Fully tailored dark mode color palettes across all navigation flows and card components, complete with skeleton loading states and pull-to-refresh functionality.

* **Deep Media Archives:** Dedicated `SectionList` architecture displaying categorized theatrical films, animated TV series, and notable comic book issue appearances.

* **Resilient HTML Rendering:** Parses complex character biographies natively using `react-native-render-html` with custom `baseUrl` injection to resolve relative images and prevent iOS rendering crashes.

* **Local Persistence:** Uses `@react-native-async-storage/async-storage` to save user agent clearance profiles and favorite targets.

## 📱 Tech Stack

* **Framework:** React Native (Expo / Bare workflow compatible)

* **Navigation:** React Navigation (Native Stack Navigator)

* **API Integration:** Comic Vine REST API (`/characters/` and search endpoints)

* **Parsing:** `react-native-render-html`

* **Styling & Animations:** React Native StyleSheet, Animated API, and System Color Scheme hooks

## 🛠️ Installation & Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/marvel-react-native-app.git
   cd marvel-react-native-app
   
   ```

2. **Install dependencies:**

   ```
   npm install
   
   ```

3. **Configure your API Key:**

   * Sign up for a free developer account at [Comic Vine API](https://comicvine.gamespot.com/api/).

   * Open `src/screens/CharactersScreen.tsx` and `src/screens/MediaArchivesScreen.tsx`.

   * Replace the placeholder string `'YOUR_COMIC_VINE_API_KEY'` with your actual alphanumeric API key.

4. **Run the application:**

   * For iOS:

     ```
     npx pod-install ios
     npm run ios
     
     ```

   * For Android:

     ```
     npm run android
     
     ```

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
