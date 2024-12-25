## Before Pushing to GitHub

Before pushing your changes to GitHub, please make sure to run the following command:

```bash
npm run format
```

## UI Libraries

This project uses the following UI libraries:

- **NextUI**: A modern React UI library for building responsive interfaces.
- **lucide-react**: A collection of beautifully simple and consistent React icons.
- **zustand**: A lightweight and flexible state management library for React.
- **zod**: A TypeScript-first schema declaration and validation library, enabling robust type-safe validation.
- **react-hot-toast**: A lightweight and customizable toast notification library for React, designed for simplicity and aesthetics.

## Resolving Compatibility Issue

This error occurs because Next.js 15 depends on the React 19 release candidate (RC).
To maintain dependency consistency, we recommend the following approach:

### 1. Uninstall the current version of Next.js

```bash
npm uninstall next
```

### 2. Install Next.js version 14

```bash
npm install next@14
```

### 3. Install React 18 and ReactDOM 18

```bash
npm install react@18.2.0 react-dom@18.2.0
```

### 4. Install NextUI and Framer Motion

```bash
npm i @nextui-org/react framer-motion
```
