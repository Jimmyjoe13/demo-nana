# d-mo-ai

d-mo-ai is a full-stack web application built with React and Express, featuring a modern frontend powered by Vite and Tailwind CSS, and a backend API server with session management and OpenAI integration. The project uses Drizzle ORM for database interactions and includes various UI components and hooks for a rich user experience.

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)
- A PostgreSQL database (if using database features with Drizzle ORM)
- Environment variables setup (e.g., `SESSION_SECRET` for session management)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd d-mo-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the Development Server

To start the development server with hot-reloading for both client and server:

```bash
npm run dev
```

This will start the Express server on port 5000 and serve the React frontend via Vite.

Open your browser and navigate to `http://localhost:5000` to access the app.

## Building for Production

To build the client and bundle the server for production:

```bash
npm run build
```

This will create a production build of the React app and bundle the server code into the `dist` directory.

To start the production server:

```bash
npm start
```

The server will run on port 5000 and serve the built client and API.

## Project Structure

- `client/` - React frontend source code
  - `src/` - React components, hooks, pages, providers, and utilities
  - `index.html` - HTML template for the React app
- `server/` - Express backend source code
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `services/` - Backend service modules (e.g., Google APIs, webhooks)
  - `config.ts` - Server configuration
- `shared/` - Shared types and services between client and server
- `attached_assets/` - Project assets and screenshots
- Configuration files for Vite, Tailwind CSS, TypeScript, and Drizzle ORM in the root directory

## Technologies Used

- React 18 with TypeScript
- Express.js backend with TypeScript
- Vite for frontend build tooling
- Tailwind CSS for styling
- Drizzle ORM for database management
- OpenAI API integration
- Radix UI components
- React Query for data fetching
- Passport.js for authentication
- Google APIs integration

## License

This project is licensed under the MIT License.
