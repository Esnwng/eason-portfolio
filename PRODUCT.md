# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: admissions readers and film-programme reviewers (US universities, film/media programmes) who open the link from a Common App "Additional Information" field or an application portfolio slot. They spend under a minute, on a laptop, deciding whether the applicant is a serious practitioner. Secondary: film-festival programmers and jurors checking a credited cinematographer; teachers and peers.

(Inferred from the brief, not interviewed: the student and his parent will also use the site as the single place to point anyone to.)

## Product Purpose

A professional portfolio for Eason Wang, a high-school (9th grade) cinematographer and photographer. It must read as a working practitioner's site, not a student showcase. Success: a reader understands within seconds that he shoots narrative film and still photography, sees the strongest work first, finds the festival record, and can pull a printable CV.

## Positioning

Credited cinematographer on a festival-awarded short (Anna's Diary: Chinh Gold, 17th International Chinh India Kids Film Festival, Nov 2023; Official Selection, Ethos International Children's Film Festival, Santa Monica) plus a body of still photography made on location (Tibet, Beijing, East Africa 2024). The combination of film credit and location stills is the claim; nothing is invented beyond it.

## Operating Context

Owner is a teenager who maintains the site himself after two 45-minute lessons: adding photos to a folder, adding a JSON file per film/award/press item, editing bio text on GitHub's web UI. No CMS, no database, no backend. Deployed on Vercel from a GitHub repository; content lives in `src/content/`.

## Capabilities and Constraints

- Static Astro site. Content collections: films, galleries (photo series), awards, press, exhibitions, site text.
- Films are embedded from YouTube (click-to-load, nocookie); the site hosts no full-length video. One 27 s clip is self-hosted.
- Photos are web-sized (≤2400 px) JPEGs; originals are not in the repo.
- Sections with no entries (press, exhibitions) must not render.
- No analytics, cookies, forms, logins.
- Undecided: contact email (parent decides), years for the Tibet and Beijing series, exact date of the Ethos selection (recorded as 2026).

## Brand Commitments

- Name as displayed: "Eason Wang". Tagline currently "Cinematographer & Photographer".
- Privacy: no school name, age, grade, or city on the site (minor).
- English-first; Chinese not required on the site.
- The user's stated direction for this redesign: a professional practitioner's portfolio with a premium, cinematic feel; motion, reflective/light-based details welcome; nothing student-like or playful.

## Evidence on Hand

- `src/content/films/anna-s-diary.json` + poster (frame from the film's YouTube thumbnail). YouTube ID n1pE0BL3fTk.
- Award certificate scan: `src/content/awards/2023-11-chinh-gold.jpg`.
- Photo series: tibet (16), beijing (8), wildlife (9 + 1 clip), cars (3), environment (4 mixed-media pieces, not photography).
- No press, no exhibition records yet (he took part in a group photography exhibition; details and links not yet supplied).
- No portrait of Eason, no logo, no behind-the-scenes stills, no reel. Do not fabricate any of these.

## Product Principles

1. Work first: the artifact leads every surface; chrome recedes.
2. Nothing fabricated: every credit, date, and claim traces to supplied evidence.
3. Maintainable by a teenager: content is files; design never depends on hand-edited markup.
4. Reads as a practitioner: tone, density, and detail match a working DP's site, not a school project.
5. Fast and quiet on a laptop: an admissions reader on wifi gets the first viewport instantly.
