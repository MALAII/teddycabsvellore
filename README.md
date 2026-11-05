# Teddy Cabs Vellore — Website

Friendly, energetic cab booking website for **teddycabsvellore.com**.

Static HTML5 + CSS3 + vanilla JavaScript. No frameworks, no build step, no backend.
Deploy by copying this folder to any static host.

---

## 1. Quick start

| Item | Value |
| --- | --- |
| Local preview | `python3 -m http.server 8080` then open `http://localhost:8080/` |
| Entry point | `index.html` |
| Stylesheet | `css/style.css` |
| Script | `js/script.js` |
| Primary colour | Orange `#F07842` on deep navy `#172B49`, light blue `#EAF2F8` |
| Type | Plus Jakarta Sans (headings) + Inter (body), self-hosted |

---

## 2. ⚠️ Before going live — 3 required actions

### 2.1 Add the WhatsApp number (blocking)

The business number has **not** been supplied, so it is intentionally empty. Open `js/script.js` and
edit the `TEDDY` object at the top of the file:

```js
const TEDDY = {
  name: "Teddy Cabs Vellore",
  domain: "https://teddycabsvellore.com",
  whatsappNumber: "",   // <-- add e.g. "919876543210"  (country code + number, digits only)
  phoneNumber: "",      // <-- add e.g. "+91 98765 43210"
  email: ""             // <-- add e.g. "hello@teddycabsvellore.com"
};
```

While `whatsappNumber` is empty, the booking form **does not pretend** to send anything. It validates
the form, then shows an honest notice explaining that WhatsApp is not connected and offers a "copy
enquiry details" button. Add a number and the same form opens
`https://wa.me/<number>?text=<formatted enquiry>` with every field included.

### 2.2 Publish contact details

The contact page intentionally shows placeholders ("Number to be published", "Address to be
published", "Hours to be confirmed") plus a Google Maps placeholder. Nothing has been invented.
Update `contact.html` when the real details exist.

### 2.3 Publish the rate card

`tariff.html` uses "To be confirmed" throughout because no rates were supplied. Replace the
placeholders once the official rates exist, and update the FAQ that explains why rates are pending.

**Optional:** connect the contact form to a real form endpoint. It currently validates and prepares
the enquiry only, which the page copy states clearly.

---

## 3. Pages

| File | Purpose | Schema |
| --- | --- | --- |
| `index.html` | Home: split hero, ticker, booking widget, services, bento benefits, vehicles, coverage chips, routes, steps, FAQ | TaxiService, WebSite, WebPage, ItemList, FAQPage |
| `about.html` | Story, values, working process, team note | AboutPage, BreadcrumbList |
| `services.html` | Six service blocks + comparison table + service FAQs | Service (×6 in ItemList), FAQPage, BreadcrumbList |
| `tariff.html` | Vehicle cards, fare components table, FAQ | OfferCatalog, FAQPage, BreadcrumbList |
| `contact.html` | Contact form, channel placeholders, map placeholder | ContactPage, BreadcrumbList |
| `privacy.html` | Privacy policy | WebPage, BreadcrumbList |
| `terms.html` | Terms & conditions | WebPage, BreadcrumbList |

SEO files: `robots.txt`, `sitemap.xml`, `assets/favicon.svg`, `assets/apple-touch-icon.png`,
`assets/og/*.jpg` (one Open Graph image per page).

---

## 4. Design system notes

* **Layout** — deliberately different from the sister site: light split hero with floating photo card,
  pill navigation, rounded 16–34 px cards, bento benefit grid, chip-based coverage list, dashed route
  cards. No editorial serif or gold rules anywhere.
* **Typography** — Plus Jakarta Sans 800 headings with tight tracking; `clamp()` from 42→84 px hero,
  34→54 px section headings, 17→19 px body.
* **Motion** — hero entrance stagger, slow image zoom, floating badges, an infinite ticker, card
  reveals with per-item delays, icon rotations on hover, button sheen. All disabled under
  `prefers-reduced-motion`.
* **Images** — 23 locally hosted, optimised photographs (`assets/images`), `object-fit: cover`,
  explicit dimensions, lazy loading below the fold.
* **Accessibility** — one `<h1>` per page, skip link, labelled fields with inline errors,
  `aria-expanded` accordions, visible focus states, AA contrast.

---

## 5. Photo licensing — please verify before commercial launch

Photographs were sourced from Pexels (Pexels License) and Wikimedia Commons (CC BY / CC BY-SA / CC0 /
public domain) and are stored locally in `assets/images/`.

* Pexels images may be used commercially without attribution, but must not imply endorsement by the
  people or brands shown.
* CC BY / CC BY-SA images **require attribution** if retained. Replace them with original fleet
  photography if you prefer a clean, zero-obligation setup.

Images illustrate vehicle **categories**, not the actual fleet, and carry no business branding. Real
photography of your own cars will always convert better — plan to swap it in after launch.

---

## 6. Deployment

1. Upload the whole folder to a static host (Netlify, Vercel, Cloudflare Pages, cPanel, S3…).
2. Point `teddycabsvellore.com` at it and enable HTTPS.
3. Verify `/`, `/about.html`, `/services.html`, `/tariff.html`, `/contact.html`, `/robots.txt`,
   `/sitemap.xml` all resolve.
4. Submit `https://teddycabsvellore.com/sitemap.xml` in Google Search Console.
5. Complete section 2 (WhatsApp number, contact details, rate card).
6. Validate structured data with <https://validator.schema.org/> and the Rich Results Test.

---

## 7. Quality checks performed

* 7 pages audited at 1440, 1280, 1024, 768, 390 and 360 px — no horizontal overflow, no console
  errors, no duplicate `id`s, no broken internal links, one `<h1>` per page.
* JSON-LD parses on every page and contains only confirmed information (no invented phone, address,
  coordinates, hours, prices, ratings or reviews).
* Forms tested: empty submit flags all required fields, invalid mobile numbers rejected, unconfigured
  WhatsApp shows the honest notice rather than a fake success message.
* Mobile sheet navigation, sticky header, accordions, ticker cloning and route pre-fill verified in a
  browser.

---

© Teddy Cabs Vellore. Built as a static site for teddycabsvellore.com.
# teddycabsvellore
