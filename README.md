# ImageFlow

ImageFlow is a Next.js application that combines ai powered image generation with intelligent chat capabilities. Create images and chat with ai, all in one place.

## Tech Stack

- **Next.js** - React framework for production
- **Convex** - Backend-as-a-Service for real-time data and functions
- **AI SDK** - AI model integrations for chat and image generation
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)

## Getting Started

### Step 1: Install Dependencies

First, install all project dependencies:

```bash
pnpm i
```

### Step 2: Setup Convex

In your first terminal, start the Convex development server. This will set up your Convex backend and sync your functions:

```bash
pnpm convex dev
```

This command will:
- Initialize your Convex project (if not already done)
- Start the Convex development server
- Watch for changes in your Convex functions
- Provide you with deployment URLs and configuration

**Note:** Keep this terminal running throughout development.

### Step 3: Start the Development Server

Open a **second terminal** and start the Next.js development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Development Workflow

1. **Terminal 1**: Run `pnpm convex dev` (keep running)
2. **Terminal 2**: Run `pnpm dev` (keep running)
3. Open [http://localhost:3000](http://localhost:3000) in your browser

Both servers will automatically reload when you make changes to your code.

## Project Structure

- `/src/app` - Next.js app router pages and routes
- `/src/components` - React components and UI elements
- `/convex` - Convex backend functions and schema

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
