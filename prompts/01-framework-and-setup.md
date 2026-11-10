# Prompts — 01 Framework & Setup

The planning prompts and the prompts that built the project's foundation:
scaffolding, cleanup, shared layout, configuration fixes, and cleanup before
the final commit.

**A note on wording:** every prompt below is quoted **exactly as I sent it**,
pulled from the session history (only line-wrap artifacts are normalized).
The "Result" lines are short summaries of what the agent did.

## Working agreements (set up early)

> Hi. We'll be working on assignment two in the current assignment two folder
> in just a moment. I'll give you some prompts, and you can go through and
> complete them in order.

> Can you walk me through Node.js? Is it installed on our system yet?

> I'll try to communicate with you in both Chinese and English, but if there's
> something I don't know how to express, I might switch to Chinese.

> Don't worry about the other files. The work we do going forward will be in
> this folder. There's a portfolio folder inside it that's currently empty,
> and that's where we'll put everything when it's ready.

## Understanding the assignment

> The requirement for this assignment is to build a webpage using Node.js.

> This assignment has two parts, Part 1 and Part 2, and the first part has
> its own specific requirements.
>
> Ultimately, we need to push the whole thing to our Git repository and then
> submit the repo URL on another website to complete the assignment submission.

> Build a Next.js portfolio website with at least four pages, dynamic routing,
> and a contact form. Use the Viber Coding Agent to develop the site and
> review the quality of its generated code. This portfolio will be extended
> in the midterm.
>
> This section gives an overview of the task, just a rough outline. We'll have
> requirements and some more details coming up soon.
>
> Let's discuss this first and map out the workflow. Once we've got the
> process locked down, you can follow it step-by-step to handle the setup.

> As I mentioned earlier, our assignment will have two versions: Assignment 1
> and Assignment 2. The core difference is that they use different HTML
> requests and server response communications. I can write down these
> requirements for you to look over.
>
> The key idea is that both versions communicate with a server using HTTP
> requests and responses. What changes is how the page gets updated:
>
> 1 Server-rendered version: The server builds HTML containing the tasks, and
>   the browser loads the resulting page.
>
> 2 API-driven version: JavaScript in the browser sends a request, receives
>   task data as JSON, and updates the existing page without a full reload.

> I can tell you that the first part of what we're doing involves using
> routing to create a page like this. That's essentially our first version.

> No, not "First Part." I mean Part 1, which is the first part of Assignment 1
> that we're working on right now.

> So we're working on Part 1 of Assignment 2 right now. That's essentially the
> first version.

Side sessions that fed into this: one chat-only session in Chinese about what
Node.js, Vercel, CSS and HTML are, including the two-forms question:

> 我们课上还提到过一个叫服务器 server 的概念，就是关于服务器返回的问题。搭建的好像有两种形式：一种是请求页面，还有一种是对服务器发起请求，它们好像是有不同的，对吧？
>
> 我想知道它们之间的区别是什么？是不是一般有两种，一种是请求页面，还有一个是请求数据，对吧？

And one session reading the assignment handout (in Chinese):

> 读一下这个 handout，翻译一下也行，或者说放一个中文版在这个文档里，没读懂啥意思

> 这个主要提示词记录是什么意思？加这个 2 到 3 个 AI 提议是什么意思？

## The project brief (exact)

> Hi! Before we start, I want to give you an overview of the project. Please
> do NOT run any commands, create any files, or change anything right now.
> Just read this and reply with a short summary so I know you understand.
>
> Project: a personal portfolio website for my university course
> (ISBA 2438, AI Assisted Software Development). This is Part 1 of the
> assignment. Part 2 will extend the same project later.
>
> Tech: Next.js (App Router), TypeScript and Tailwind CSS. The project will
> live in the current folder.
>
> What Part 1 needs:
> - Pages: a landing page at /, an About Me page at /about-me, a projects
>   list at /projects, and a detail page for each project at
>   /projects/<slug> using one dynamic route. Two projects, and a friendly
>   message for an unknown slug.
> - A contact form at /contact-me-server-form with name, email and message.
>   It posts to a Server Action on the server, which validates the input and
>   saves valid submissions to a JSON file. The page shows a clear success or
>   error message. No API route and no client-side fetch in this part.
>
> How we will work:
> - I will give you one stage at a time. After each stage I will check the
>   result myself before giving you the next one.
> - Keep the code simple and easy for a student to explain. Pages in app/,
>   reusable UI in components/, server logic in lib/.
> - Do not add libraries I did not ask for, and never invent facts about me.
> - Do not run any git commands unless I ask.
> - When you finish a stage, list the files you created or changed and tell
>   me how to check the result.
>
> Again: no actions for now. Please just confirm you understand and summarize
> the project in a few sentences.

> Good summary. To answer your question: "current folder" means
> assignment2/portfolio. Work only inside that folder. Do not read, open or
> change anything outside it; the parent folder contains my private notes and
> course files that are not part of this project. Still no actions for now.

## Stage 0 — Project setup (exact)

> Set up a new Next.js project directly in the current folder, which is empty.
> 1. Run exactly:
>    npx create-next-app@latest . --ts --tailwind --eslint --app --import-alias "@/*" --use-npm --disable-git --no-agent-feedback --yes
> 2. Add this line to .gitignore: data/contact-submissions.json
> 3. Run `npm run dev` once to confirm the starter page loads, then stop it.
> 4. Run `git init`, then `git status` and show me the output, then make the
>    first commit "Scaffold Next.js app". Do not add any Co-Authored-By line.
> 5. Explain in simple words what each top-level file and folder is for.
> Do not create any pages yet, and do not create or change anything outside
> the current folder.

**Result**: scaffolded with create-next-app; added the data file to
`.gitignore`; committed "Scaffold Next.js app" (no Co-Authored-By).

The stage-gate review, as I recorded it:

> Stage 0 check: I checked it myself. The starter page loads on
> localhost:3000, git log shows one commit "Scaffold Next.js app", and
> .gitignore ends with data/contact-submissions.json. I also added my resume
> at public/Resume.pdf. Do not commit anything until I ask.

## Stage 1 — Cleanup (exact)

> Stage 1, step 1. Let's clean up the starter stuff first:
> - In app/page.tsx, remove all the default content and just put a simple
>   heading for now. We'll build the real home page later.
> - Delete the sample SVG files in public/ (file.svg, globe.svg, next.svg,
>   vercel.svg, window.svg). Keep Resume.pdf!
> - In app/globals.css, keep the Tailwind import and a light theme, and
>   remove the dark-mode part.
> Don't commit. Tell me which files you changed or deleted.

**Result**: home page reduced to a heading; 5 SVGs deleted; dark-mode block
removed from `globals.css`.

## Stage 2 — Shared layout (exact)

> Next, can you make the nav bar and the layout that every page shares? Keep
> it simple and light, with Tailwind.
>
> Put the nav bar in components/NavBar.tsx. My name, Heliang Gao, goes on the
> left. On the right I want four links: Home goes to /, About Me goes to
> /about-me, Projects goes to /projects, and Contact goes to
> /contact-me-server-form. Use next/link for those. Then add a Resume link to
> /Resume.pdf that opens in a new tab. That one's a file, not a page, so just
> use a regular `<a>` tag.
>
> In app/layout.tsx, show the nav bar at the top of every page, the page
> content in the middle, and a small footer with my name and the year. Just
> type the year in. Don't use new Date(), because this version of Next.js
> breaks the build when you do that.
>
> Make the browser tab title say "Heliang Gao - Portfolio".
>
> The other pages aren't built yet, so it's fine if those links show 404 for
> now. Don't commit. Tell me which files you made or changed.

**Result**: `components/NavBar.tsx` (next/link for pages, plain `<a>` for the
PDF) and the shared `app/layout.tsx` with footer and tab title.

## Process documentation

> I think you can put together a readme document right now, like a Part 1
> readme or Part 1 process document. That way, we can include the details
> we've discussed so far, and it'll also make my review process easier later
> on.

**Result**: the process document (in the assignment folder, outside this
repo) plus this `prompts/` log.

> We're almost done. Can you write up a log of the main prompts I sent you in
> this chat, in PROMPT_LOG.md? Can you keep the prompt high-level without
> getting bogged down in details? Just summarize or extract the methods,
> goals, and what you did. Do you think you can do that?

**Result**: created `PROMPT_LOG.md` with summarized stages.

> Can we also include the details we discuss later in the prompt_log?
> Another thing: could we split that prompt file into two or three? I don't
> think the naming is very clear either.
>
> We could divide them by what each prompt handles. You could also set up a
> separate folder just for prompts and organize them by function, for
> instance, separating the ones used for building the framework from the ones
> that handle details. How do you think we should categorize this?

**Result**: split into the `prompts/` folder (01/02/03 by function) and
updated the README links.

> Let's double-check the organization and summary of the prompt. It's best to
> use the exact wording rather than a summary.

**Result**: recovered the exact prompts from the session history and rewrote
these log files with verbatim quotes.

> Could you check our README file to see how the content looks and whether
> our project description is accurate? The README is right in the portfolio
> folder.

> Could you rewrite this for me so it can introduce the project

**Result**: `README.md` rewritten as a project-specific introduction (what
the site is, the Part 1 stack, how to run it, and the prompt log).

> I still need a short critique of the code. Can you add CODE_CRITIQUE.md to
> the prompts folder with these examples: the email box that quietly removed
> spaces at the start and end, the email check that let a tab through, and
> the code review where I picked number 1 and skipped the rest. For each
> one: what you suggested, what I decided and why, which file, how I checked
> it, and what actually happened. Then a few lines on what's good and what
> could be better.

> Small edit to CODE_CRITIQUE.md: in example 1, the real check was typing
> "  a@b.com  " into the email box. Before the fix the spaces disappeared,
> after the fix they stayed and the server rejected it. In example 2, the
> real check was testing about 20 sample emails: before the fix the one with
> a tab was accepted, after the fix all of them were judged correctly.

**Result**: [`CODE_CRITIQUE.md`](./CODE_CRITIQUE.md) with the three
examples and the overall assessment, corrected to the real verification
steps.

## Stage 16 — Runtime warnings (exact)

> I can still see two issues in the bottom-left Node.js panel. It seems to be
> a language problem. Could you take a look and see what's going on? It does
> give a couple of potential solutions, but I'm not sure which one is better.
> Is it a language-loading issue?

> Next.js encountered runtime data during prerendering. This prevents the
> route from being prerendered, blocking navigation and leading to a slower
> user experience. Learn more
>
> lib/language.ts (5:30) @ getLanguage
>
>     3 |
>     4 | export async function getLanguage(): Promise<Language> {
>   > 5 |   const store = await cookies();
>       |                              ^
>     6 |   return store.get("language")?.value === "zh" ? "zh" : "en";
>     7 | }
>     8 |
>
> There is one more issue here, which is that it seems to be a rendering
> problem.

**Result**: two fixes. First, the Node "module type" warnings — added
`"type": "module"` to `package.json` (keeps the TS config; the alternative
rename to `.mjs` would drop type safety). Second, the prerendering conflict —
with Cache Components on, pages that read `cookies()` can't be prerendered;
turned `cacheComponents` off in `next.config.ts` so every page renders on the
server per request, which is exactly the Part 1 (server-rendered) concept.
Verified with a clean `npm run build`.

## Cleanup before commit

> Before I commit: there's a dev.log file and two .swp files left over from
> vim. Do we need any of these, or can you clean them up?

**Result**: deleted all three (a stray dev-server log and two stale vim swap
files) and added `*.swp` and `dev.log` to `.gitignore`.

## Notes

- After every stage: TypeScript typecheck, dev-server checks of each page,
  and a list of files created/changed with instructions for reviewing the
  result.
- Commits are made only when I ask; final commit/push happens at submission
  time.
- Long-term hosting question I asked:

> If I want to keep displaying this page long-term, do I need to move it from
> my local machine somewhere else so it stays live?

**Result**: discussed Vercel; noted that the JSON-file storage is local to
the server — a natural extension point for the midterm.
