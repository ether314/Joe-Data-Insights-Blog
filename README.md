# Data Insights Blog

A Visual Capitalist–inspired data analytics blog built with Next.js and Firebase (Google Cloud). Host canvas visualizations from Cursor with no commenting system.

## Features

- **Landing page** with hero, featured visualizations, latest posts, and browse-by-category sections
- **Category pages** for Economics, Technology, Demographics, Energy, Markets, and Maps
- **Individual post pages** with full-width canvas images and rich content
- **Firebase backend** — Firestore for posts, Cloud Storage for images, Firebase Hosting for deployment
- **Local development** with sample data (no Firebase account required to start)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Adding Your Canvas Images

1. Export images from Cursor Canvas (PNG or SVG)
2. Place them in `public/images/` for local dev, or upload to Firebase Storage under `canvas-images/` when connected
3. Update post entries in `src/data/posts.ts` (local) or Firestore (production)

### Post schema (Firestore collection: `posts`)

```json
{
  "slug": "my-visualization",
  "title": "Charted: My Data Story",
  "excerpt": "Short description for cards and SEO",
  "content": "Full markdown-style content with ## headings",
  "category": "Economics",
  "imageUrl": "/images/my-chart.svg",
  "imageAlt": "Description for accessibility",
  "publishedAt": "2026-07-05T12:00:00Z",
  "featured": true
}
```

## Connect Firebase (Google Cloud)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore** and **Storage**
3. Copy `.env.example` to `.env.local` and fill in your web app config
4. Deploy security rules:

```bash
npx firebase-tools@latest login
npx firebase-tools@latest use YOUR_PROJECT_ID
npx firebase-tools@latest deploy --only firestore:rules,storage
```

5. Add posts to the `posts` collection in Firestore (use the schema above)
6. Upload canvas images to Storage at `canvas-images/` and set `imageUrl` to the public URL

## Deploy

Build and deploy to Firebase Hosting:

```bash
npm run build
npx firebase-tools@latest deploy --only hosting
```

The site exports as static HTML (`output: "export"`) for fast CDN delivery.

## Project Structure

```
src/
  app/              # Next.js pages (home, blog/[slug], category/[slug])
  components/       # Header, Footer, PostCard, Hero, etc.
  data/posts.ts     # Sample posts for local development
  lib/              # Firebase config and post fetching
  types/post.ts     # TypeScript types and categories
public/images/      # Canvas images and placeholders
```

## Design

Inspired by [Visual Capitalist](https://www.visualcapitalist.com/) — dark navy header, featured hero cards, category tags, latest posts grid, and sidebar category navigation.
