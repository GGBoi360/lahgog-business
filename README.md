# lahgog.com: "לחגוג לעסקים" (R87, stage A)

A static site for businesses, kept apart from the app's site (`../site/`, lahgog.app). Built 2026-11-16 by the
website session. Decisions and their sources: `docs/website/DECISIONS.md` ("Business list and labelling (R87)");
research: `docs/website/research/vendor-site.md` (§5.3 is the plan this follows).

- **Pages:** `/` (who it's for, the two first categories, what exists today vs. later, "fair to both sides"),
  `/apply` (the application), `/verification` (what the free "עסק מאומת" mark checks and means), `/privacy` (this
  site's own policy; the app's is lahgog.app/privacy), `404.html`.
- **Owner's decisions it follows (2026-11-12):** first categories kids' birthday entertainers and workshops; the mark is
  free and means only that the business exists and the applicant represents it; no payment system, so nothing here
  sells anything. Never: fake counters, logos of businesses that didn't agree, dates promised for "later" items.
- **The application has no server.** `apply.js` checks the fields and opens an email to `business@lahgog.app` with the
  answers, and shows the same text to copy. So `business@lahgog.app` must forward (Porkbun) to the owner's mailbox,
  and the privacy page names Porkbun and Google for that reason. If a server form ever replaces it, that's a new data
  flow: update `privacy.html` first.
- **Shared look:** `landing.css`, `fonts/` and the icons are copies from `../site/`; `biz.css` adds this site's parts.
  After a change to `../site/landing.css` that matters here, copy it again.
- **Publishing:** this folder is the source of truth; the public repo **GGBoi360/lahgog-business** (GitHub Pages,
  branch `main`, root, custom domain `lahgog.com` via `CNAME`) only mirrors it, like `site/` and GGBoi360/lahgog-site.
  To publish: copy this folder's files over a clone of that repo, commit, push.
- **DNS (Porkbun, owner):** the apex `lahgog.com` A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153` and AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
  `2606:50c0:8003::153`; `www` CNAME `ggboi360.github.io`. Then "Enforce HTTPS" in the repo's Pages settings.
