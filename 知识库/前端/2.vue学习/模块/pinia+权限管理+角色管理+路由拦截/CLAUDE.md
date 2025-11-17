
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 device management system with role-based access control (RBAC) built using Vite. The project demonstrates a complete implementation of user authentication, role management, and route-based permission control using Pinia for state management.

## Common Development Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
Currently no test framework is configured. Consider adding Vitest for unit testing.

## Architecture Overview

### Core Technologies
- **Vue 3** with Composition API and `<script setup>` syntax
- **Pinia** for state management
- **Vue Router 4** for routing with meta-based permission control
- **Element Plus** for UI components
- **Vite** for build tooling

### Project Structure
```
device-management/
├── src/
│   ├── components/        # Reusable Vue components
│   ├── stores/           # Pinia stores for state management
│   ├── router/           # Vue Router configuration
│   ├── views/            # Page-level components
│   ├── assets/           # Static assets
│   ├── App.vue           # Root component
│   ├── main.js           # Application entry point
│   └── style.css         # Global styles
├── public/               # Public assets
└── dist/                 # Build output
```

### Key Architecture Patterns

#### 1. Authentication & Authorization
- **User Store** (`src/stores/user.js`): Centralized user state management
- **Role-based Access Control**: Two roles - 'admin' and 'user'
- **Route Guards**: Implemented in `src/router/index.js` with `beforeEach` hook
- **Persistent Sessions**: Using localStorage for token and user data

#### 2. Route Permission System
Routes are protected using meta fields:
- `requiresAuth`: Boolean flag for authentication requirement
- `roles`: Array of allowed roles for the route

The router guard automatically:
- Redirects unauthenticated users to login page
- Checks role permissions before allowing access
- Prevents authenticated users from accessing login page

#### 3. State Management
Pinia store structure:
- **State**: username, role, token
- **Getters**: isLoggedIn, isAdmin
- **Actions**: login (async), logout

### User Roles and Permissions

#### Admin Role
- Access to all routes including `/device-management`
- Can view admin-specific features in dashboard

#### User Role
- Limited to basic routes: `/dashboard`, `/home`
- Cannot access device management features

### Test Credentials
- **Admin**: username: `admin`, password: `admin`
- **User**: username: `user`, password: `user`

## Development Notes

### Adding New Protected Routes
1. Add route to `src/router/index.js`
2. Include meta fields: `{ requiresAuth: true, roles: ['admin', 'user'] }`
3. Create corresponding view component in `src/views/`

### Extending User Roles
1. Update role validation in `src/router/index.js`
2. Modify user store login logic in `src/stores/user.js`
3. Update route meta fields as needed

### UI Components
All UI components use Element Plus. Icons are globally registered in `main.js`.

### Styling
- Global styles in `src/style.css`
- Component-scoped styles using `<style scoped>`
- Element Plus theme can be customized through CSS variables
