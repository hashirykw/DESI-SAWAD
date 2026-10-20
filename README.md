# Desi Sawad website

Six pages: `index.html` (home), `menu.html`, `gallery.html`, `about.html`, `reserve.html`, `contact.html`.
All files sit in one flat folder, with no subfolders. Upload the whole folder to GitHub, Vercel or Netlify as it is.

## Quick edits
- **Prices, dishes and descriptions:** `data.js`, in the `DS.MENU` list. Set `p: 25` to show "SAR 25". Leave `p: null` to show "Price on WhatsApp".
- **Gallery photos:** `data.js`, in `DS.GALLERY`. Add a `.webp` file next to the others and add one line here.
- **Chatbot answers:** `data.js`, in `DS.KB` (keywords plus the reply).
- **Phone, WhatsApp, hours and socials:** `data.js`, in `DS.CONTACT`.
- **Colours and both themes:** the top of `styles.css` (`:root` is dark, `[data-theme="light"]` is light).

## Files
- `styles.css`: all styles
- `app.js`: nav, themes, sound, cart, WhatsApp ordering, chatbot, lightbox, booking
- `dish3d.js`: the 3D handi, karahi and glass on the home page
- `three.min.js`, `gsap.min.js`, `lenis.min.js`: libraries (local, with no CDN needed)
- `*.woff2`: fonts (local)
- `*.webp`: photos

Orders and bookings open WhatsApp to +966 57 606 1979 with the details written out.
