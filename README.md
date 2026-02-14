# Liliana Gorga — Developer Portfolio (Frontend)

Angular frontend for a personal developer portfolio, featuring project showcase, contact form, and an admin dashboard for content management.

## Tech Stack

- **Angular 19** — standalone components, new control flow (`@if`, `@for`), reactive forms
- **TypeScript** — strict typing with interfaces for all data models
- **SCSS** — CSS custom properties theming, responsive design, animations
- **RxJS** — reactive HTTP communication with the backend API

## Features

- **Home** — hero section with introduction and featured projects
- **Projects** — grid layout with project cards, tech stack tags, GitHub/demo links
- **Contact** — form with validation, sends messages to the backend
- **Login** — JWT-based authentication
- **Admin Dashboard** — CRUD management for projects and messages (protected route)

## Project Structure

```
src/app/
├── components/         # Navbar, Footer
├── guards/             # Auth route guard
├── interceptors/       # JWT auth interceptor
├── models/             # TypeScript interfaces
├── pages/              # Home, Projects, Contact, Login, Admin
└── services/           # Auth, Project, Message API services
```

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 19+
- Backend API running on `http://localhost:8080`

### Installation

```bash
npm install
ng serve
```

The app runs at `http://localhost:4200`. API requests are proxied to the backend via `proxy.conf.json`.

## Backend

This frontend connects to a Spring Boot REST API with MongoDB Atlas. The backend handles authentication, project CRUD, and message storage.
