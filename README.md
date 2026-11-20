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
| `/schedule` | My Schedule: my busy time slots, so visitors can see when I'm free |
| `/questions` | My Questions: a private list where visitors jot down questions they want to ask me (saved in your browser) |
| `/admin` | Admin hub linking to the four admin pages below |
| `/admin/blogs` | Write and publish a new blog post, edit or delete existing ones |
| `/admin/schedule` | Manage time slots shown on My Schedule |
| `/admin/projects` | Manage projects (English required, Chinese optional) |
| `/admin/contacts` | Read, update, and delete messages from the contact form |
| `/contact-me-server-form` | Contact form submitted via a Server Action |
| `/contact-me` | Same contact form, submitted with `fetch` to the API |

Features: a language switch (English / 中文, stored in a cookie), a dark mode
toggle, friendly not-found pages for unknown projects and blog posts, and two
ways to submit the contact form — Server Action vs. API — as a comparison.
The My Questions list lives entirely in your browser: questions are saved to
localStorage, so they survive a refresh but are never sent to a server. All
API validation messages follow the language switch. Note that the admin pages
have no login — anyone who knows the URL can edit the content.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Server Actions and Route Handlers, no database

## API routes

| Method | Route | Success | What it does |
| --- | --- | --- | --- |
| `GET` | `/api/blogs` | 200 | Returns all blog posts |
| `POST` | `/api/blogs` | 201 | Creates a post (`title`, `content`); the slug is generated from the title |
| `GET` | `/api/blogs/[slug]` | 200 | Returns one post |
| `PUT` | `/api/blogs/[slug]` | 200 | Updates a post |
| `DELETE` | `/api/blogs/[slug]` | 200 | Deletes a post |
| `GET` | `/api/schedule` | 200 | Returns all time slots |
| `POST` | `/api/schedule` | 201 | Creates a time slot (`date`, `startTime`, `endTime`, `title`) |
| `GET` | `/api/schedule/[id]` | 200 | Returns one time slot |
| `PUT` | `/api/schedule/[id]` | 200 | Updates a time slot |
| `DELETE` | `/api/schedule/[id]` | 200 | Deletes a time slot |
| `GET` | `/api/projects` | 200 | Returns all projects |
| `POST` | `/api/projects` | 201 | Creates a project; English is required, Chinese is optional |
| `GET` | `/api/projects/[slug]` | 200 | Returns one project |
| `PUT` | `/api/projects/[slug]` | 200 | Updates a project; fields left out keep their current value |
| `DELETE` | `/api/projects/[slug]` | 200 | Deletes a project |
| `GET` | `/api/contacts` | 200 | Returns all contact messages |
| `POST` | `/api/contacts` | 201 | Validates and saves a contact message |
| `GET` | `/api/contacts/[id]` | 200 | Returns one contact message |
| `PUT` | `/api/contacts/[id]` | 200 | Updates a contact message |
| `DELETE` | `/api/contacts/[id]` | 200 | Deletes a contact message |

Invalid requests get a `400` with field-level error messages in the visitor's
language; unknown ids or slugs get a `404`.

## Project structure

```
app/                        pages, layouts, and not-found screens (routes)
  api/                      Route Handlers: contacts, blogs, schedule, projects
  admin/                    admin hub + editors for blogs, schedule, projects, contacts
  blogs/[slug]/             blog post pages + friendly not-found
components/                 reusable UI (NavBar, cards, forms, toggles)
lib/                        content/i18n, validation, Server Actions, storage
prompts/                    AI prompt logs and code critiques
public/                     static files (Resume.pdf, profile.jpg)
data/                       runtime data (see below)
```

## Data storage

There is no database. Everything is stored as JSON files under `data/`, read
and written by the server only:

| Data | File | In the repo? |
| --- | --- | --- |
| Blog posts | `data/blogs.json` | Yes, versioned with the code |
| Projects | `data/projects.json` | Yes, versioned with the code |
| Schedule time slots | `data/schedule.json` | Yes, versioned with the code |
| Contact messages | `data/contact-submissions.json` | No, git-ignored |

Contact messages are **not** in the repository because they hold personal
information (names, emails, messages). The file is created on the server the
first time someone submits the contact form. My Questions (`/questions`) are
stored in the browser's localStorage only — they never reach the server.

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

## License

[MIT](./LICENSE) © 2026 Heliang Gao
