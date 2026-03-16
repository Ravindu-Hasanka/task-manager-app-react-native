# Design Document

## 1. System Overview

### 1.1 Problem Statement

Dr. Nimal manages a busy daily workflow and depends on mobile access to stay organized. A generic task list is not enough for his use case because it does not clearly prioritize urgent work, does not surface daily workload quickly, and increases the risk of missing critical tasks. The assignment scenario highlights five main pain points:

- Poor task prioritization
- No structured workflow
- Limited visibility into daily workload
- Risk of missing critical medical tasks
- No productivity tracking

### 1.2 Proposed Solution

MediTask Pro is a React Native mobile task management application built for fast daily task handling. The solution focuses on:

- Simple task creation and editing
- Priority-based task organization
- Clear task status tracking
- Daily visibility through dashboard progress
- Offline-aware behavior with retry and fallback support
- Backend synchronization through a mock REST API

The app is designed to give users a mobile-first workflow where they can quickly:

1. View task summaries
2. Search and filter tasks
3. Add a new task
4. Edit task details
5. Mark tasks as completed
6. Delete tasks when no longer needed

### 1.3 Tech Stack Justification

- `Expo + React Native`
  Chosen for rapid mobile development, native device support, and easier delivery for Android builds.

- `TypeScript`
  Used for stricter contracts, safer refactors, and better maintainability at SE level.

- `Expo Router`
  Keeps routing simple and file-based while allowing clean screen separation.

- `Zustand`
  Lightweight global state management with minimal boilerplate, well suited for task list and mutation state.

- `Axios`
  Clean API abstraction, timeout handling, and centralized interceptor-based error normalization.

- `React Hook Form + Yup`
  Efficient form state management with reusable validation rules for add/edit flows.

- `NetInfo`
  Enables online/offline awareness and retry behavior.

- `React Native Gesture Handler`
  Supports swipe-based task actions for a more mobile-friendly interaction model.

## 2. System Architecture

### 2.1 High-Level Architecture

The application follows a layered feature-oriented structure:

```text
app/                  Expo Router entry points
src/api/              Axios client and task service
src/components/       Reusable UI building blocks
src/screens/          Screen-level presentation logic
src/store/            Zustand store and task state mutations
src/hooks/            Shared hooks for connection, theme, toast
src/utils/            Formatting, filtering, and form helpers
src/constants/        Theme configuration
src/types/            Shared TypeScript types
src/assets/           Images and static assets
```

### 2.2 Key Architectural Decisions

- API access is isolated in `src/api/`
- Store logic is centralized in Zustand for predictable task updates
- Form validation rules are shared across add and edit flows
- Theme generation is centralized to support light and dark mode
- Error handling is normalized before reaching screens
- UI states such as loading, retry, empty, offline, and success feedback are separated into reusable components or hooks

## 3. Feature Summary

### 3.1 Dashboard

- Greeting header for Dr. Nimal
- Current date display
- Today-focused summary
- Completed and pending counters
- Progress bar
- Quick access add button

### 3.2 Task List

- Search by title, description, and category
- Filter by status
- Filter by picked due date
- Sort by due date ascending or descending
- Swipe to complete
- Swipe to delete

### 3.3 Task Form

- Add task
- Edit task
- Validation for:
  - Title
  - Description
  - Category
  - Due date/time
  - Priority

### 3.4 Task Details

- View task content
- Toggle status
- Edit task
- Delete task with confirmation

### 3.5 Reliability and UX

- Pull-to-refresh
- Offline banner
- Retry mechanism
- Initial load error screen
- Toast notifications
- Light and dark theme support

## 4. Designs

### 4.1 High-Fidelity Direction

The implemented UI follows a clinical productivity style with:

- Blue as the primary action color
- Strong card-based layout
- High contrast text for readability
- Large touch targets
- Soft rounded corners for mobile comfort
- Dark and light mode support

### 4.2 Figma Link

Add your actual Figma link here before submission:

`Figma: https://www.figma.com/design/PoCHer9uCkr8bLvuIRcfrm/Task-Manager---React-Native?node-id=11-2&t=t8REyuWPtyCSica8-1

## 5. Assumptions

- The primary target user is an Android-first mobile user
- The user usually has internet access, but temporary offline periods are expected
- Tasks are lightweight and do not require attachments
- One task belongs to a single category and one priority level
- Backend is a mock API and does not require authentication
- Due date is sufficient for workflow prioritization in this assignment scope
- The submission focuses on mobile usability rather than tablet-specific layouts

## 6. User Guide

### 6.1 Installation

1. Clone the repository
2. Install dependencies using `npm install`
3. Run the project using `npm run start`
4. Open on Android emulator, device, or Expo Go

### 6.2 Add a Task

1. Open the dashboard or task list
2. Tap the floating add button
3. Fill in title, description, category, due date/time, and priority
4. Tap `Save Task`
5. A success toast confirms the task was created

### 6.3 Edit a Task

1. Open a task from the list
2. Tap `Edit Task`
3. Update the desired fields
4. Tap `Update Task`
5. A success toast confirms the update

### 6.4 Complete a Task

1. Open a task and switch its status to completed
2. Or swipe a task card to complete it from the list
3. The task status updates and a toast confirms the action

### 6.5 Delete a Task

1. Open a task detail view or swipe from the task list
2. Confirm deletion if prompted
3. The task is removed and a success toast is shown

### 6.6 Filter and Sort Tasks

1. Use the search input to find tasks by text
2. Use status chips to narrow by pending or completed
3. Use the due date picker to show tasks for a selected day
4. Use the sort control to order tasks by nearest or latest due date

### 6.7 Offline Mode

1. If connection is unavailable on initial load, an error screen is displayed
2. The user can retry or continue in offline mode
3. If connection drops later, an offline banner appears

## 7. Non-Functional Considerations

### 7.1 Maintainability

- Typed models across the app
- Clear separation between API, store, UI, and utility layers
- Reusable shared UI and helper functions

### 7.2 Usability

- Mobile-first design
- Clear hierarchy and large touch targets
- Immediate feedback through loaders, confirmations, and toasts

### 7.3 Reliability

- API timeout handling
- Centralized error normalization
- Offline-aware user flows
- Retry support

### 7.4 Scalability

The current structure can be extended to support:

- Authentication
- User-specific task ownership
- Notification reminders
- Task categories and tags from backend-managed data
- Analytics dashboards
- Pagination and caching
