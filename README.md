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
| `npm test`                        | Run the unit tests with Jest              |

## How it's built

```
src/
  api/          http.ts → omdb.ts → queries.ts
  components/   presentational: props in, no data fetching
  screens/      connect the query hooks to components
  navigation/   the stack and its typed params
  homeRows.ts   the rows on the home screen
  theme.ts      colors, spacing, typography
  types.ts      the app's own Movie and MovieDetails types
```

Data flows in one direction:

1. `http.ts` fetches JSON and throws `ApiError` on failure. It knows nothing about movies.
2. `omdb.ts` handles OMDb's quirks and maps its JSON into the app's types. For example, `"N/A"` means a missing value, numbers arrive as strings, and errors can come back with HTTP 200.
3. `queries.ts` wraps those functions in TanStack Query hooks, which handle caching, retries, paging and cancellation.
4. Screens call the hooks and pass plain data to components.

To add a screen, add a route in `navigation/` and a file in `screens/` that reuses the existing hooks and components.

## Decisions and tradeoffs

- **The home rows are searches.** OMDb has no genre or trending endpoints, so each row in `homeRows.ts` is a search query.
- **FlatList, not FlashList.** Each row holds a few dozen posters, so the built-in list is fast enough. FlashList is the next step for much longer lists.
- **The HD poster is a URL trick.** OMDb only returns 380px posters. The hero and details screen request a 1000px version by changing the image URL. The small poster shows while it loads.
- **The API key is in the app bundle.** Expo copies any variable prefixed `EXPO_PUBLIC_` into the app, so anyone with the app can read the key. That's acceptable for a free OMDb key. A production app would call OMDb through its own backend and keep the key on the server.
- **Tests cover the API layer.** That's where the logic that could break lives: mapping, error handling and paging.
