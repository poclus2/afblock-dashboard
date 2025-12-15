# Afblock Admin Dashboard

A professional, high-performance administrative interface for the Afblock platform, built to manage users, wallets, transactions, and P2P trades with efficiency and ease.

## 🚀 Overview

The Afblock Admin Dashboard serves as the central control hub for the Afblock ecosystem. It provides administrators with real-time insights, user management capabilities, and comprehensive tools to oversee compliance and operational flows. The application is designed with a focus on ease of use, performance, and scalability.

## 🛠 Technology Stack

This project leverages a modern, robust, and type-safe stack:

### Core Framework
- **[React 18](https://reactjs.org/)**: A library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Strictly typed superset of JavaScript for enhanced code quality and maintainability.
- **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling for lightning-fast development and build speeds.

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Shadcn UI](https://ui.shadcn.com/)**: A collection of re-usable components built using Radix UI and Tailwind CSS.
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
- **[Recharts](https://recharts.org/)**: Redefined chart library meant to be fast and composable.

### State Management & Data Fetching
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Powerful asynchronous state management for server state.
- **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible and extensible forms with easy-to-use validation.
- **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library.

### Routing & Utilities
- **[React Router DOM](https://reactrouter.com/)**: Declarative routing for React applications.
- **[Axios](https://axios-http.com/)**: Promise based HTTP client for the browser and node.js.
- **[date-fns](https://date-fns.org/)**: Modern JavaScript date utility library.

## 🏗 Architecture

The application follows a modular and feature-based architecture to ensure scalability and maintainability.

- **`src/components`**: Reusable UI components.
    - **`ui`**: Base components (buttons, inputs, etc.) from Shadcn UI.
    - **`dashboard`, `users`, `wallets`**, etc.: Feature-specific components.
- **`src/pages`**: Top-level page components corresponding to routes.
- **`src/services`**: API integration and service layers.
    - **`api.ts`**: Centralized API configuration and endpoints.
- **`src/hooks`**: Custom React hooks for logic reuse.
- **`src/types`**: TypeScript type definitions and interfaces.
- **`src/contexts`**: React Context providers (e.g., Theme, Auth).

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Armel206/afblock-admin.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd afblock-admin
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    npm ci
    ```

### Development

To start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

To run the linter and fix issues:

```bash
npm run lint
```
