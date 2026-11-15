# Assignment 2 — Part 2: Complete Prompt Record

A verbatim record of the prompts sent to the Viber Coding Agent during Part 2
of the portfolio (this file's prompts are quoted exactly as written,
including typos and missing spaces). Each prompt is followed by a short note
on what changed as a result.

---

### 1. Context and scope

> We're going to work on the updated version of our assignment two portfolio shortly, which we're calling part 2. In this folder, our code and content are located in the folder named "portfolio". You'll be working right here, and you don't need to read or understand any of the other files. The rest of the materials are for my own reference and aren't meant for you, so don't learn from the content inside them.
>
> /Users/gao/Desktop/ISBA2438_Fall2026_AIAssistedSoftwareDevelopment/assignment2/portfolio

No code changes. The agent explored the `portfolio/` folder and summarized
the existing Part 1 structure (routes, components, lib, data).

### 2. Bilingual replies

> I have an additional request, and I'm not sure if you can do this. Whenever I give you a request or write a prompt for you, it's usually in English, though sometimes in Chinese. When you reply to me, I'd like you to provide a Chinese version alongside the English part as well. Is that possible?
>
> 也就是我给你的提示词是单一的一种语言，你给我输出的话，要输出两种语言，可以做到吗？

No code changes. The agent now replies in both English and Chinese.

### 3. Orientation: how the Part 1 contact form works

> Hi! Let's start Part 2 of my portfolio. This is the Next.js (App Router)project from Part 1, in the current folder. For Part 2 I'll be adding newpages on top of it, so please leave the Part 1 contact form and its files as they are unless I ask. Also please don't run any git commands, I'll do git myself at the end.
>
> Before we start, take a look at how the contact form on /contact-me-server-form works right now and explain it to me in a few sentences: which files are involved and where the messages get saved.

No code changes. Set the ground rules (Part 1 contact files untouched, no git
commands) and got an explanation of the flow:
`app/contact-me-server-form/page.tsx` → `components/ContactForm.tsx`
(`useActionState`) → `lib/contact-action.ts` (Server Action) →
`lib/contact-validation.ts` → saved by `lib/contact-submissions.ts` to
`data/contact-submissions.json`.

### 4. Acknowledgment

> Thanks, that matches what I expected.

No changes.

### 5. Contact API route

> Let's add an API for the contact form. Build a Next.js route at/api/contacts that takes a POST with a name, email and message. It should use the same validation and saving as the server form, so all the messages end up in the same JSON file. Don't build a page yet.

Created `app/api/contacts/route.ts`: a Route Handler whose `POST` reuses
`validateContactForm` and `saveContactSubmission` (same JSON file), returning
201 on success, 400 with per-field errors, 400 on malformed JSON. No page.

### 6. Null body bug

> I tested the API with curl and the normal cases work. But if I send just null as the body, it crashes with a 500 instead of a 400. Can you fix that?

Fixed `app/api/contacts/route.ts`: after parsing, the body must be a
non-null, non-array object, otherwise 400 "Request body must be a JSON
object." Verified live with `null`, `[]`, and `"string"` bodies.

### 7. API-driven contact page

> Now I want a /contact-me page with the same contact form, but it should sendthe form to /api/contacts with fetch instead of using the server action. Keep it looking the same as the server form page, and add it to the nav as "Contact (API)".

Added `app/contact-me/page.tsx` and `components/ContactFormApi.tsx` (same
look as the server form, but submits with `fetch` to `/api/contacts`).
`lib/content.ts` gained a `contactApi` nav label and `components/NavBar.tsx`
gained the "Contact (API)" link. Part 1 form files untouched.

### 8. Server-down message

> If the server is down, the page should say the message couldn't be sent, which should look different from the validation error.

`components/ContactFormApi.tsx` got its own state type with an `unreachable`
status shown as an amber banner (vs. red for validation, green for success),
with a localized `contact.serverError` message in `lib/content.ts`. The page
passes the new label.

### 9. Acknowledgment

> Checked it, looks good

No changes.

### 10. Blog API

> The contact page works. Now let's add a blog. Build a Next.js API route at/api/blogs that keeps the posts in a JSON file. GET should return all the posts, and POST should add a new one with a title and some content. Each post should get its own slug from the title. Don't build any pages yet.

Created `app/api/blogs/route.ts` (GET list, POST create with localized
validation errors) and `lib/blog-posts.ts` (storage in `data/blogs.json`,
Unicode-aware slugs from titles, `-2`/`-3` suffixes on duplicates).
`lib/content.ts` gained a `blog` section; `.gitignore` gained an entry
(later removed, see 11).

### 11. Blog posts belong in git

> I noticed the blog posts file was added to .gitignore. Please take it out.Unlike the contact messages, the blog posts are meant to be public, so they should go to GitHub with the code.

Removed `data/blogs.json` from `.gitignore` (comment restored to cover only
contact submissions) and created `data/blogs.json` as an empty array so there
is a file to commit.

### 12. Blog admin page

> I want an admin page at /admin/blogs where I can write a new post. It shouldsend the post to /api/blogs with fetch, and show green and red messages like the contact form. It doesn't need to be in the nav.

Added `app/admin/blogs/page.tsx` and `components/BlogPostForm.tsx` (client
component, `fetch` POST to `/api/blogs`, green/red banners, field errors,
pending state). The blog API's 201 response now includes a localized success
message; `lib/content.ts` gained the page labels. Nav unchanged.

### 13. Blog pages

> Now add a /blogs page that gets the posts from GET /api/blogs with fetch andlists all of them. Each post should have its own page at /blogs/[slug], like the project pages, with a friendly message if the post doesn't exist. Add "Blogs" to the nav, in both languages.

Added `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`,
`app/blogs/[slug]/not-found.tsx` (friendly "Post not found" page, mirroring
the projects pattern), `components/BlogCard.tsx`, and `lib/blog-api.ts`
(server-side self-fetch of the API). Nav gained "Blogs" / 博客. Fixed during
testing: Chinese slugs arrive URL-encoded in `params`, so matching falls back
to `decodeURIComponent`.

### 14. Client-side fetch for the list

> When I open /blogs, I don't see a GET request to /api/blogs in the browser'sNetwork tab, because the page calls the API on the server. I'd like the browser to fetch the posts from /api/blogs after the page loads, so the request shows up in the Network tab. Show a loading message while it waits. The individual post pages can stay as they are.

Added `components/BlogList.tsx` (client component: localized "Loading posts…"
message, then `fetch("/api/blogs")` in `useEffect`, red error message on
failure). `app/blogs/page.tsx` became a thin wrapper; `formatPostDate` moved
to the new `lib/blog-format.ts` so the client bundle doesn't include
`next/headers`. Detail pages unchanged.

### 15. Acknowledgment

> All good

No changes.

### 16. Documentation

> We're almost done. Please create two files in the prompts folder, withoutchanging any code:
>
> 1. Assignment_Part2_Prompts.md: a full record of the prompts I sent you in this chat for Part 2, quoted exactly as I wrote them, each followed by a short note on what changed. Complete prompt records, with content required to be verbatim.
>
> 2. Code_Critique_Part2.md: a short critique of the code you wrote in this chat. Pick two or three moments where your first version wasn't what I wanted. For each one, write what you proposed, what I decided and why, the related file, how it was checked, and what actually happened.

Created this file and `Code_Critique_Part2.md` in `prompts/`. No code
changes.
