# Prompts — 03 Features & Polish

The prompts that built the interactive features and the visual/behavioral
refinements, plus the code reviews and fixes.

**A note on wording:** every prompt below is quoted **exactly as I sent it**,
pulled from the session history (only line-wrap artifacts are normalized).
The "Result" lines are short summaries of what the agent did.

## Stage 8 — Contact form UI (exact)

> Next, let's make the contact page at /contact-me-server-form. For now I
> just want it to look right: a title, a friendly line, and a form where
> people can type their name, email and a message.

> When someone clicks on the word "Name" or "Email" next to a box, the cursor
> should jump into that box.

> One thing: I don't want the browser checking the form on its own, like
> popping up "please fill out this field." The server will do all the
> checking later, so please turn that off for now. No commits yet.

> Looks good! Two small things. Could you move the form into its own separate
> component, so the page just shows the title and the form? It'll keep
> things tidy when we connect it to the server. And please make the email box
> a plain text box. The email-type box quietly removes spaces at the start
> and end, so the server would never get to see them.

**Result**: `app/contact-me-server-form/page.tsx` and
`components/ContactForm.tsx`; labels focus fields via the `for` attribute;
added `noValidate` and `type="text"` so the server sees the raw input.

## Stage 9 — Validation rules (exact)

> Now let's write the rules for checking the form, in their own file. Don't
> hook them up to the form yet. Name and message can't be empty, and just
> spaces counts as empty.

> For the email, I want it to be strict: exactly one @, something before it,
> a dot after it, no empty bits around the dots (so a@b..com is wrong), and
> no spaces anywhere, not even at the start or end. Please keep each rule
> simple and easy to read, because I'll need to explain it.

**Result**: `lib/contact-validation.ts` with `validateContactForm` and
`isValidEmail` — one small, readable check per rule.

## Stage 10 — Save to JSON + connect (exact)

> Next, when someone sends a valid message, I want it saved to a JSON file in
> a data folder, with the name, email, message and the time it was sent.

> Now connect the form to the server. When someone clicks Send, the server
> should check what they typed with our rules, and only save it if everything
> is okay. Please don't use an API for this, that's for a later part of the
> assignment.

**Result**: `lib/contact-submissions.ts` (appends to
`data/contact-submissions.json` with an ISO `sentAt`) and
`lib/contact-action.ts` (Server Action: validate, save only if valid); wired
the form via `action={...}`; verified end-to-end through the real form POST.

## Stage 11 — Feedback messages (exact)

> If it works, show a green message. If not, show a red message that says
> what's wrong. No commits yet.

> It looks like we missed something earlier. the email check only looks for
> regular spaces. Can it reject any kind of blank character, like tabs, too?

> Can you walk me through, in plain words, what happens from clicking Send to
> seeing the green or red message? Tell me which file does what.

**Result**: converted the form to a client component with `useActionState`;
added success/error banners plus per-field red errors; the email check
became `/\s/.test(...)` to reject any whitespace; walked through the flow.

## Stage 13 — Organization review (exact)

> Can you look over how the code is organized and tell me if anything is
> messy or in the wrong place? Don't change anything yet, just give me a
> short list.

> Let's do number 1 so the home page uses the same project info. Skip 2, 3
> and 4. They're small, and the code is easy to follow as it is.
>
> Also, one thing in your walkthrough isn't quite right: when there's an
> error, the boxes actually get cleared. Can you make them keep what the
> person typed?

**Result**: fixed #1 — the home page now sources its featured cards from
`lib/projects.ts`; #2–#4 skipped as documented trade-offs. Also fixed the
walkthrough's error: the form now keeps typed values on failure
(`defaultValue` from the action's returned state).

## Stage 14 — Dark mode (exact)

> Do you think there's any possibility of adding color or visual polish to
> our overall interface? From your perspective, we currently have almost no
> styling or aesthetic enhancements to speak of.

> I want to add a feature to switch between dark mode and light mode on this
> page.
>
> What do you think? The current state is light mode, with black text on a
> white background. For dark mode, you can take inspiration from Apple's
> desktop color standards.
>
> The toggle button could be placed at the top of the homepage, for instance
> to the left of the home configuration. Can you do that?

**Result**: `components/ThemeToggle.tsx`; class-based `dark` variant in
Tailwind with Apple-dark colors (`#1d1d1f` background, `#f5f5f7` text,
`#2c2c2e` cards, `#0a84ff` buttons); a pre-paint script so reloads don't
flash; choice remembered in `localStorage`, falling back to the system
setting. (Also covered the general styling pass that came with the polish
question.)

## Stage 15 — Bilingual site (exact)

> The dark and light mode is great. Another thing: the sun icon for the color
> toggle seems to have a rendering issue, like a few of the little rays are
> missing. Could you fix that?
>
> Second, this is currently an all-English version, right? Could you add
> another button next to the sun icon to switch between Chinese and English?
> And then, could you write another version of my stuff in Chinese so we
> have both Chinese and English versions?
>
> Also, there's the matter of my name. One other thing: do you think I can
> add an English name after mine? Like Tony.

> The English name should be formatted in this style, right after my name.
> Heliang Gao (Tony)

**Result**: redrew the sun icon; added cookie-based language switching
(`lib/language.ts`, `lib/language-action.ts`,
`components/LanguageToggle.tsx` — still a plain form POST to a Server
Action, fully server-rendered); moved all UI text and resume content into
`lib/content.ts` dictionaries (EN/ZH) and localized `lib/projects.ts`; pages
read the language from the cookie; display name "Heliang Gao (Tony)" in nav,
home, footer, and tab title.

## Stage 17 — Lint + script warnings (exact)

> Two small fixes: the code checker shows one error in the dark mode button,
> and the page shows a "1 Issue" warning about a script in the layout. Can
> you fix both?

**Result**: the lint error was `setState` called directly inside the
toggle's effect — rewritten with no React state at all: the click handler
reads the current theme from the `<html>` class, and the sun/moon icons
switch via CSS (`dark:inline` / `dark:hidden`). The script warning is React's
dev warning for `<script>` tags rendered in JSX — fixed with a
doc-recommended `components/InlineScript.tsx` helper (`type="text/javascript"`
on the server so it executes pre-paint, `type="text/plain"` on the client so
it never re-runs) and moved the theme script into `<head>` as the docs'
theme example shows. Verified: lint and typecheck clean, build passes, script
renders inside `<head>`.

See also [`CODE_CRITIQUE.md`](./CODE_CRITIQUE.md) for the review of the
generated code.
