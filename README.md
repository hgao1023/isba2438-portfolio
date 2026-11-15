# Heliang Gao (Tony) — Portfolio

My personal portfolio site, built with [Next.js](https://nextjs.org) (App
Router) and TypeScript. English and Chinese, light and dark mode.

## What's on the site

| Route | What it shows |
| --- | --- |
| `/` | Home: short intro, what I do, featured projects |
| `/about-me` | Bio, education, experience, skills, resume (PDF) |
| `/projects`, `/projects/[slug]` | Project list and detail pages |
| `/blogs`, `/blogs/[slug]` | Blog list (loaded from the API in the browser) and post pages |
| `/admin/blogs` | Write and publish a new blog post |
| `/contact-me-server-form` | Contact form submitted via a Server Action |
| `/contact-me` | Same contact form, submitted with `fetch` to the API |

Features: a language switch (English / 中文, stored in a cookie), a dark mode
toggle, friendly not-found pages for unknown projects and blog posts, and two
ways to submit the contact form — Server Action vs. API — as a comparison.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Server Actions and Route Handlers, no database

## API routes

| Method | Route | What it does |
| --- | --- | --- |
| `POST` | `/api/contacts` | Validates and saves a contact message |
| `GET` | `/api/blogs` | Returns all blog posts |
| `POST` | `/api/blogs` | Creates a post (`title`, `content`); the slug is generated from the title |

## Project structure

```
app/                        pages, layouts, and not-found screens (routes)
  api/                      Route Handlers: contacts, blogs
  admin/blogs/              blog post editor
  blogs/[slug]/             blog post pages + friendly not-found
components/                 reusable UI (NavBar, cards, forms, toggles)
lib/                        content/i18n, validation, Server Actions, storage
prompts/                    AI prompt logs and code critiques
public/                     static files (Resume.pdf, profile.jpg)
data/                       runtime data (see below)
```

## Data storage

There is no database. Contact messages are appended to
`data/contact-submissions.json` (git-ignored), and blog posts live in
`data/blogs.json` (versioned with the code). Both are read and written by the
server only.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

## About this project

This site started as a course project for **ISBA 2438 (AI-Assisted Software
Development)** at Santa Clara University and is now my personal portfolio. It
was built with the **Viber coding agent** — the prompt-by-prompt history and
code critiques are in the [`prompts/`](./prompts/) folder.
