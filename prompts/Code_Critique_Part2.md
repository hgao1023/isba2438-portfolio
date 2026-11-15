# Code Critique — Part 2

A short critique of the code written by the agent during Part 2, focused on
three moments where the first version wasn't what the user wanted.

---

## 1. A `null` request body crashed the contact API with a 500

- **What I proposed:** `app/api/contacts/route.ts` with a `try`/`catch`
  around `request.json()`, assuming that covered every bad body, plus
  validation of the parsed fields.
- **What you decided and why:** You tested the API with `curl -d 'null'` and
  reported a 500 instead of a 400. `null` is *valid* JSON, so my catch never
  fired — the crash happened later, reading `.name` on `null`. You wanted bad
  bodies rejected with 400 like other invalid input.
- **Related file:** `app/api/contacts/route.ts`
- **How it was checked:** Your curl reproduction first; after the fix, live
  requests with `null`, `[]`, and `"string"` (all 400 with "Request body must
  be a JSON object."), a valid post (201), plus `npm run lint` and
  `npx tsc --noEmit`.
- **What actually happened:** Added an explicit check that the parsed body is
  a non-null, non-array object before touching its fields. The 500 is gone;
  the same guard pattern was reused in the blog API.

## 2. I put the blog data file in `.gitignore`

- **What I proposed:** While building the blog API I copied the contact
  pattern and added `data/blogs.json` to `.gitignore`, treating it as
  runtime-only data.
- **What you decided and why:** Blog posts are public content and should be
  versioned and pushed to GitHub with the code — unlike contact messages,
  which are private submissions.
- **Related file:** `.gitignore` (plus creating `data/blogs.json`)
- **How it was checked:** A read-only `git check-ignore -v data/blogs.json`
  (exit code 1 = no longer ignored), and visual confirmation of the restored
  comment block.
- **What actually happened:** Removed the entry and restored the original
  comment (which now covers only `data/contact-submissions.json`), and
  created `data/blogs.json` as `[]` so there is a starter file to commit.

## 3. The `/blogs` list fetched posts on the server

- **What I proposed:** A server component that fetched `GET /api/blogs`
  itself (`lib/blog-api.ts` self-fetch via the request host) and rendered all
  cards in the initial HTML.
- **What you decided and why:** Opening `/blogs` showed no request to
  `/api/blogs` in the browser's Network tab, because the call happened on the
  server. You wanted the browser to fetch the posts after page load so the
  API-driven approach is visible in DevTools, with a loading message while it
  waits. The detail pages could stay as they were.
- **Related files:** `components/BlogList.tsx` (new), `app/blogs/page.tsx`,
  `lib/blog-format.ts` (new), `lib/content.ts`
- **How it was checked:** `npm run lint` and `npx tsc --noEmit`; curl of
  `/blogs` shows the localized "Loading posts…" and zero post links in the
  initial HTML; the RSC payload references the `BlogList` client chunk and the
  chunk contains `fetch("/api/blogs")`; `/blogs/[slug]` still returns 200.
- **What actually happened:** The list now loads client-side with a
  "Loading posts…" state (and a red error message if the request fails);
  `formatPostDate` moved to `lib/blog-format.ts` so the client bundle doesn't
  pull in `next/headers`; the detail pages kept their server-rendered
  behavior.
