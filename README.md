# Task Manage App

Task Manage App is an Expo + React Native assessment project for managing daily work with a clean mobile-first task flow. The app supports task listing, search, filtering, add/edit/delete, swipe actions, progress tracking, light/dark mode, offline awareness, and API-backed persistence.

## Tech Stack

- Expo Router
- React Native
- TypeScript
- Zustand
- React Hook Form
- Yup
- Axios
- `@react-native-community/datetimepicker`
- `@react-native-community/netinfo`

## Features

- Dashboard with summary cards and task progress
- Search and status filtering
- Add task form with validation
- Edit task form with validation
- Native date and time input for due dates
- Task details view
- Swipe to complete and delete
- API-backed create, update, complete, and delete flows
- Offline banner and retry flow
- Light and dark theme support

## Project Structure

The app uses `app/` for Expo Router entry files and `src/` for the application architecture.

```text
app/
  (tabs)/
  task/
  add-task.tsx
  _layout.tsx
src/
  api/
  assets/
  components/
  constants/
  hooks/
  navigation/
  screens/
  store/
  types/
  utils/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Expo CLI via `npx expo`
- Android Studio emulator, iOS simulator, or Expo Go

### Install Dependencies

```bash
npm install
```

### Environment Setup

The API base URL is configured through an Expo env file.

Default local setup:

```bash
.env
```

Required variable:

```bash
EXPO_PUBLIC_API_BASE_URL=https://60a21a08745cd70017576014.mockapi.io/api/v1
```

An example is also included in:

```bash
.env.example
```

### Run the App

Start the Expo development server:

```bash
npm run start
```

Open a target platform with one of these commands:

```bash
npm run android
npm run ios
npm run web
```

## Quality Checks

Run linting:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

## API

The app reads the mock API base URL from `EXPO_PUBLIC_API_BASE_URL` in the project `.env` file.

Supported endpoints:

- `GET /todo`
- `GET /todo/:id`
- `POST /todo`
- `PUT /todo/:id`
- `DELETE /todo/:id`

Axios response interceptors normalize API, timeout, and offline errors into consistent user-facing messages before they reach the store and screens.

## Form Validation

Task forms are built with React Hook Form and Yup. Both add and edit screens validate:

- Title
- Description
- Category
- Due date and time
- Priority

Shared form rules live in `src/utils/task-form.ts`.

## Offline Behavior

- Network state is tracked with NetInfo
- The offline banner appears above the tab header
- Initial offline launch shows a full retry screen
- Existing task data remains visible when the device goes offline after a successful load

## Deployment

### Local Android Build

For a local native build, prebuild the project and generate Android output:

```bash
npx expo prebuild
```

Then open `android/` in Android Studio and create an APK or AAB from the generated native project.

### Expo / EAS Build

If you want a cloud build flow, install the EAS CLI and run:

```bash
npx eas build -p android
```

This is the recommended path for generating a shareable Android artifact during submission prep.

## Notes

- `app/` is still required because the project uses Expo Router.
- The main application code lives in `src/` so routing stays thin and features stay organized.
