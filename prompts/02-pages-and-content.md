# Prompts — 02 Pages & Content

The prompts that created the site's pages and their content, all sourced from
my resume.

**A note on wording:** every prompt below is quoted **exactly as I sent it**,
pulled from the session history (only line-wrap artifacts are normalized).
The "Result" lines are short summaries of what the agent did.

## Stage 3 — Content source (exact)

> Now please read my resume at public/Resume.pdf. If you can't open the PDF,
> just stop and tell me. List all the projects you find in it. Then pick the
> two with the most detail. Those two will get their own pages on the site.
> Tell me which two you picked and why. Don't change any files for this one.

> Sounds good, let's use both projects. For the slugs, let's keep them short:
> ai-competitive-intelligence and bank-marketing-prediction. When we build
> the project pages, I'll give you a few more details for each one.

**Result**: extracted the resume text; found exactly two projects and picked
both; agreed the slugs `ai-competitive-intelligence` and
`bank-marketing-prediction`.

## Stage 4 — Home page (exact)

> OK, now let's build the real home page in app/page.tsx. Only use what's in
> my resume. Please don't make anything up.
>
> At the top, show my name and one line about me. Then a short bio. Then a
> "What I do" section with three things I'm good at, based on my resume. Then
> a "Featured projects" section that briefly mentions the two projects we
> picked and links to /projects. At the end, add a button that goes to
> /contact-me-server-form.
>
> Keep the style the same as the nav bar. Don't commit. Tell me which files
> you changed.

> One small thing: the bio on the home page and the one on About Me are
> almost the same paragraph. Can you cut the home page bio down to one or two
> short sentences, since it's just an overview? Keep the full version on
> About Me. Still only use what's in my resume, and no commits.

**Result**: built `app/page.tsx`, then trimmed the home bio to two short
sentences.

## Stage 5 — About Me (exact)

> Checked the home page, it looks great. Next, let's do the About Me page at
> /about-me. Can you put it in app/about-me/page.tsx? Same as before, only
> use what's in my resume, nothing made up.
>
> I'm thinking four sections: a short bio, Education, Experience, and Skills.
> For Experience, list each role with the company, the dates, and one or two
> highlights. Skills can just be a simple list or some small tags. And add a
> link somewhere that opens my full resume (/Resume.pdf) in a new tab.
>
> Keep the same look as the home page. Still no commits for now. Let me know
> which files you add or change.

**Result**: `app/about-me/page.tsx` with bio, education, experience, and
skills as small tags, all from the resume.

## Stage 6 — Projects data + list (exact)

> The home page bio looks much better now, thanks. Next up are the projects.
> Let's start with the data and the list page.
>
> Can you make lib/projects.ts with our two projects in it? Use the slugs we
> agreed on: ai-competitive-intelligence and bank-marketing-prediction. For
> each project I'd like a title, a one-line summary, the dates, the tech
> used, a short paragraph about what it is, a list of what I did, and the
> outcome. Only use what's in my resume plus the notes below. If something
> isn't there, just leave it out instead of guessing. Also add two helper
> functions: getAllProjects() to get both, and getProjectBySlug(slug) to get
> one, or undefined if there's no match.
>
> Then a card component in components/ProjectCard.tsx that shows the title,
> summary, dates and tech, and links to /projects/<slug>.
>
> And the list page at /projects (app/projects/page.tsx): a heading, one
> short intro line, and a card for each project.
>
> Still no commits. Let me know which files you add.

**Result**: `lib/projects.ts` (data + `getAllProjects` / `getProjectBySlug`),
`components/ProjectCard.tsx`, and `app/projects/page.tsx`.

## Stage 7 — Dynamic routing (exact)

> Cards look good. Now the detail pages. Can you make one page,
> app/projects/[slug]/page.tsx, that works for both projects?
>
> It should read the slug from params. In this version of Next.js params is a
> Promise, so it needs an await. Then look the project up with
> getProjectBySlug, and if there's no match, call notFound() from
> next/navigation. Please also export generateStaticParams with our two
> slugs, because the build fails without it in this version. Show all the
> project info, plus a "Back to projects" link.
>
> Then two not-found pages. app/projects/[slug]/not-found.tsx should say that
> project doesn't exist and link back to /projects. app/not-found.tsx is for
> any other wrong address. It should say the page wasn't found and link back
> to the home page.
>
> One heads-up: in this version a wrong slug might come back as status 200
> instead of 404, even though the not-found page shows. That's fine, no need
> to fix it.
>
> When you're done, could you explain in plain words how the [slug] folder
> turns a URL into a page? I'll need to explain it myself later. No commits.

**Result**: `app/projects/[slug]/page.tsx` (await params, `notFound()`,
`generateStaticParams`), `app/projects/[slug]/not-found.tsx`,
`app/not-found.tsx`; verified real and unknown slugs; explained the
URL-to-page flow.

## Stage 12 — Photo (exact)

> I have a photo I'd like to add. Where would be the best place to put it?

> I'm not talking about which folder to put it in. I mean where on the page
> we should place it. For example, the homepage, the About Me page, or
> somewhere else? Where would look best and make the most sense?

> I've placed the file. Could you add it to the main .env? Also, the filename
> currently contains Chinese characters, so please rename it while you're at
> it.

> I mean, put it on the About Me page. That's a translation error.

**Result**: renamed to `public/profile.jpg` and placed beside the bio on the
About Me page with `next/image` (square crop, automatic resizing of the large
original). The ".env" wording was a translation slip for "put it on the page",
cleared up right after.
