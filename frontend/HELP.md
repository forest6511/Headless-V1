## Before Pushing to GitHub

Before pushing your changes to GitHub, please make sure to run the following command:

```bash
npm run format
```

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
