# Heliang Gao (Tony) — Portfolio

A personal portfolio website built for **ISBA 2438 (AI-Assisted Software
Development), Assignment 2 — Part 1**: the **server-rendered** version, where
pages and responses are generated on the server. The site will be extended in
the midterm, and Part 2 of the assignment will cover the API-driven approach.

Developed with an AI coding agent (Viber Coding Agent) — see the
[`prompts/`](./prompts/) folder for the prompt-by-prompt development log,
split by function: [`01-framework-and-setup`](./prompts/01-framework-and-setup.md),
[`02-pages-and-content`](./prompts/02-pages-and-content.md), and
[`03-features-and-polish`](./prompts/03-features-and-polish.md), plus
[`CODE_CRITIQUE.md`](./prompts/CODE_CRITIQUE.md) reviewing the quality of the
generated code.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling
- Server Actions for form handling (no API routes in this part)

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Home: short intro, what I do, featured projects, link to contact |
| `/about-me` | Bio, education, experience, skills, and a link to my resume (PDF) |
| `/projects` | List of projects |
| `/projects/[slug]` | Project detail page — one dynamic route serving both projects; unknown slugs get a friendly not-found page |
| `/contact-me-server-form` | Contact form (name, email, message) |

## How the contact form works

The form posts to a **Server Action** on the server (`lib/contact-action.ts`).
The action validates the input with the rules in `lib/contact-validation.ts`
(name and message can't be empty; strict email checks) and, when everything is
valid, appends the submission — name, email, message, and timestamp — to
`data/contact-submissions.json`. The page then shows a green success message
or red errors saying exactly what to fix. No API route and no client-side
fetch are involved.

## Running it

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:3000; if that
port is taken, Next.js picks the next one, e.g. 3001).

For a production build:

```bash
npm run build
npm start
```

## Project structure

```
app/                        pages, layouts, and not-found screens (routes)
  projects/[slug]/          the one dynamic route for all project pages
components/                 reusable UI (NavBar, ProjectCard, ContactForm)
lib/                        server logic: project data, validation, Server Action, JSON storage
public/                     static files (Resume.pdf, profile.jpg)
data/                       created at runtime; holds contact-submissions.json (git-ignored)
```
