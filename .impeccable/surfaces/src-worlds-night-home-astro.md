---
version: 1
slug: "src-worlds-night-home-astro"
primary_target: "src/worlds/night/Home.astro"
related_targets: []
---

# Surface brief: Home (world "night")

Scope: the whole site rendered by src/worlds/night/* (Home, WorkIndex, FilmPage, PhotoIndex, GalleryPage, CVPage, NotFound). Visitor mode: Experience. Audience: admissions readers and festival programmers, laptop, under a minute. Job: judge whether Eason Wang is a serious cinematographer and photographer. Proof: Anna's Diary (Chinh Gold 2023, Ethos selection), five photo series. Constraints: content files are the only source of truth; no fabricated claims; privacy (no school/age/city).

## Direction contract

THESIS: His medium is light. The site is an urban nocturne: every work is a lit window in a skyline and the wet street doubles every light. It refuses the full-bleed hero with a thumbnail grid, and it refuses to let atmosphere hide the photographs: the windows are the largest, clearest things on the page.

OWN-WORLD: Ground passes with the hour: cobalt blue hour (#0b1a3a) at the top of the site draining into rain-dark black (#07070a) through the middle and turning to silver dawn (#c9d6df on #1b2630) at the end (CV and contact). Works are lit windows: sharp image panels with a warm amber frame bleed. Beneath every window band, a wet-street mirror: the same images reflected (scaleY(-1)), masked, blurred and gently rippled; reflections never cover content. Amber (#f0a63a) is signage: the name as a rooftop sign (restrained glow), nav as street signs. Body text is a condensed dark-type voice; the name is a sign face. One world, no cards, no eyebrow labels, no gradient text.

STORY: The visitor arrives at blue hour and reads the skyline of works; the brightest window is the film and plays on click. They walk the street canyon: series as blocks of windows, each with its reflection. The award is a rooftop beacon beside the film's window. Dawn: the CV, a daylight document, and contact.

FIRST VIEWPORT: A skyline band across the full width: six or seven works as windows of different heights and widths (real images from films and galleries), set on dark tower silhouettes against a cobalt sky; the Anna's Diary window is the brightest with a small amber "Now screening" sign. The lower third is the wet street reflecting the whole band. Upper-left: EASON WANG as a rooftop sign with the tagline beneath in sign caps. Nav as a street-sign strip at the skyline's base (Work · Photography · CV). Primary action: the film window.

FORM: Rain-night cityscape, catalog challenger light-shadow-caustics-rain-night-cityscape (verdict competitive), seed key 23a73f0b. Quality bar: https://impeccable.style/worlds/cards/light-shadow-caustics-rain-night-cityscape.webp and ...-hero.webp. Signature interaction: the hour advances with scroll (sky and ground color via scroll-driven animation with a plain fallback), and rain ripples the reflections (bounded SVG displacement or CSS, cheap, paused when off-screen). Motion grammar: weather and time, nothing slides in.

Raises: one material owns the whole plane (every page is a view of the same city at some hour); every window label is measured from content data; complete keyboard traversal window by window; the CV packs facts tight as a dawn-lit notice; the walk is paced skyline, canyon, river, dawn.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
