# ExWo Movies

A Netflix-style movie browser for iOS and Android, built with React Native, Expo and TypeScript. Movie data comes from the [OMDb API](https://www.omdbapi.com/).

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and add your key:

```
EXPO_PUBLIC_OMDB_API_KEY=your_key_here
```

Git ignores `.env`. Restart the dev server after you change it.

## Run

```bash
npm start
```

In the terminal that opens:

- press `i` for the iOS Simulator
- press `a` for the Android emulator
- or scan the QR code with Expo Go (Android) or the Camera app (iOS)

## Scripts

| Command                           | What it does                              |
| --------------------------------- | ----------------------------------------- |
| `npm start`                       | Start the Expo dev server                 |
| `npm run ios` / `npm run android` | Start it and open a simulator or emulator |
| `npm run typecheck`               | Type-check with TypeScript (strict mode)  |
| `npm run lint`                    | Lint with Expo's ESLint config            |

## Note on the API key

Expo copies any variable prefixed `EXPO_PUBLIC_` into the app bundle, so the key is readable by anyone with the app. That's acceptable for a public, free OMDb key. A production app would call OMDb through its own backend and keep the key on the server.
