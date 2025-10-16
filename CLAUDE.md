# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15.5.5 application with React 19, TypeScript, and Tailwind CSS v4. Uses Turbopack for faster builds and development.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server (requires build first)
npm start
```

Development server: http://localhost:3000

## Architecture

**App Router**: Uses Next.js App Router structure with `app/` directory
- `app/layout.tsx`: Root layout defining metadata and font configuration (Geist Sans/Mono fonts via next/font)
- `app/page.tsx`: Home page component
- `app/globals.css`: Global styles with Tailwind imports and CSS custom properties

**Styling**: Tailwind CSS v4 with PostCSS
- Uses `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`)
- CSS variables for theming: `--background`, `--foreground`, `--font-geist-sans`, `--font-geist-mono`
- Dark mode via `prefers-color-scheme` media query
- Custom `@theme inline` directive in globals.css

**TypeScript**: Path alias `@/*` maps to project root, strict mode enabled

**Deployment**: Optimized for Vercel platform
