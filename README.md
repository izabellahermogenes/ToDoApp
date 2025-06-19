# My Awesome Todo App

A simple minimalist To do app built with React Native and Expo, designed to help you focus on tasks with a clear mind.

---

## Tech Stack

- **React Native** with **TypeScript** — Cross-platform mobile UI and logic  
- **Expo** — Development tools and environment  
- **React Hooks** — State management (`useState`)  
- **Animated** and **TouchableOpacity** — Interactive UI elements  

---

## Key Features

- Categorize todos by mood:  
  - ✨ Easy Wins  
  - ‼️ Urgent  
  - 💭 Someday  
- Add, toggle complete, and delete todos  
- Filter todos by all, active, or completed  
- Visual progress circle showing completion percentage  
- Responsive and clean UI with mood filters and input controls  

---

## Build Process

1. Set up a new Expo project with TypeScript support.  
2. Defined `Todo` interface to type-check todo objects.  
3. Managed todos, moods, and filters with React hooks (`useState`).  
4. Implemented functions for adding, toggling, deleting, and filtering todos.  
5. Created a custom progress circle using Views and transforms (no SVG).  
6. Styled the app with React Native's `StyleSheet` for consistency and ease of maintenance.  
7. Tested on device and simulators for smooth user experience.  

---

## Lessons Learned

- Using TypeScript interfaces improves code quality and debugging.  
- Managing multiple states (todos, filters, moods) smoothly with hooks.  
- Creative UI solutions like progress circle without third-party libraries.  
- Balancing UX for task input with toggleable input visibility.  
- Importance of accessibility and clear feedback on user actions.  

---

## Areas of Improvement

- Add drag-and-drop to reorder todos by priority.  
- Support editing existing todos instead of only adding and deleting.  
- Add notifications/reminders for urgent tasks.  
- Improve accessibility and internationalization support.  
- Enhance animations and add theming options (dark mode).

## Demo

![Demo GIF](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjdyYXFhOTZ5aTRhOG0wbmh4MTk3M2oxaWkxcmkxdmowdWZvNnlhZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dwwNVSnJLFb86QSslZ/giphy.gif)

