# Personal Website

Static portfolio site using React + MUI from CDN and in-browser Babel.

## Local Run

```powershell
py -m http.server 5500
```

Open: `http://localhost:5500`

## Project Structure

- `index.html` main page (`data-page="home"`)
- `about.html` about-focused page (`data-page="about"`)
- `contact.html` contact-focused page (`data-page="contact"`)
- `scripts/mui-app.js` app logic
- `styles/revamp.css`, `styles/dynamic-ui.css` styles
- `images/` gallery images
- `api/gallery.js` Vercel serverless endpoint for gallery image listing

## Deployment Notes

- The gallery loads images from `/api/gallery` on Vercel.
- Keep image assets in `images/`.
- Cache-busting query params are used in HTML files for CSS/JS updates.
