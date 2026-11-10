# Code Critique — Reviewing the AI-Generated Code

Part of the assignment is reviewing the quality of the code the agent
produced. These are three real examples from this project where the
AI-generated code was imperfect and human review caught it, plus an overall
assessment.

## Example 1: The email box that quietly removed spaces

- **What the agent suggested**: the initial contact form used
  `<input type="email">` — the obvious-seeming choice for an email field.
- **What I decided and why**: I changed it to a plain text box (`type="text"`).
  An email-type box silently trims spaces (and line breaks) from the start
  and end of the value before submitting, so the server would never see what
  was actually typed. Since the assignment's rule is that the *server* does
  all the checking, the server must receive the raw input.
- **File**: `components/ContactForm.tsx`
- **How I checked it**: typed `"  a@b.com  "` (with spaces at both ends) into
  the email box and submitted. Before the fix the spaces disappeared before
  reaching the server; after the fix they stayed, and the server rejected the
  address.
- **What actually happened**: the server now receives the value exactly as
  typed; if it contains whitespace anywhere, the server-side email rule
  rejects it (see Example 2).

## Example 2: The email check that let a tab through

- **What the agent suggested**: the strict email validator's "no spaces"
  rule was written as `email.includes(" ")` — a check for the literal space
  character only.
- **What I decided and why**: I pointed out that other blank characters
  (tabs, newlines) would slip through. Whitespace is whitespace, so the rule
  became `/\s/.test(email)`, which matches any blank character.
- **File**: `lib/contact-validation.ts`
- **How I checked it**: ran about 20 sample addresses through the validator.
  Before the fix the sample containing a tab was accepted; after the fix all
  of them were judged correctly.
- **What actually happened**: the validator now rejects emails containing
  any whitespace, including the kind that Example 1 guarantees the server
  will actually see.

## Example 3: The organization review where only fix #1 was applied

- **What the agent suggested**: a four-item list of organizational issues —
  (1) the home page duplicated project data from `lib/projects.ts`,
  (2) duplicated button styles, (3) a form-state type living in the
  validation file, (4) About Me data inlined in its page.
- **What I decided and why**: I applied only #1 and skipped the rest. #1 was
  a real correctness risk — two copies of the project facts would drift
  apart as the site changed — while #2–#4 are cosmetic and the code is easy
  to follow as it is.
- **File**: `app/page.tsx`
- **How I checked it**: typecheck, then fetched the home page and confirmed
  it renders the summary text coming from `lib/projects.ts`.
- **What actually happened**: `lib/projects.ts` is the single source of
  truth; the home page renders whatever the data file says. The three
  skipped items are documented, deliberate trade-offs, not oversights.

## Overall assessment

**What's good**

- Clean layering that matches the plan: routes in `app/`, reusable UI in
  `components/`, server logic in `lib/` — easy to navigate and explain.
- One source of truth for project content, with pages deriving from it.
- The contact flow is genuinely server-rendered end to end: form POST →
  Server Action → validation → JSON file, with progressive enhancement (it
  even works without JavaScript) and no API route.
- Strict, readable validation rules — one small check per rule.
- Verification discipline: typecheck plus page-by-page checks after every
  stage.

**What could be better**

- The agent's first drafts leaned on defaults that missed subtle behavior
  (the `type="email"` trimming, the space-only check). Both were caught by
  human review — validation code deserves adversarial review, not trust.
- No automated tests: verification was manual. A few unit tests for
  `isValidEmail` and `validateContactForm` would have caught the tab bug
  automatically and would guard against regressions as the midterm extends
  the project.
- Known accepted trade-offs: duplicated button styles, the form-state type
  living in the validation file, and About Me content inlined in its page.
- JSON-file storage works locally but will not persist on serverless hosting
  (the filesystem resets) — the natural upgrade path for the midterm is a
  real database.
