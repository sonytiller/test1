# MCPS Working Portal Package — Netlify + Apps Script + Google Sheets + Google Drive

This package is the clean setup I recommend now.

## Architecture

Frontend portal: Netlify static website
Backend proxy: Netlify Function at `/.netlify/functions/portal-api`
Main backend: Google Apps Script Web App `/exec`
Database: Google Sheets
Files: Google Drive

## Why this fixes your current issue

Your browser kept showing errors like `API_URL is not defined` or `failed to fetch` because old portal files were mixed together and the browser was trying to call Apps Script directly.

This package fixes that by making the public website call a Netlify Function first. The Netlify Function then talks to Apps Script from the server side.

## Files in this package

- `index.html` — the portal website your coworkers will use.
- `netlify/functions/portal-api.js` — the backend proxy that removes browser fetch/CORS problems.
- `netlify.toml` — tells Netlify where the function is.
- `Code.gs` — Apps Script backend code.
- `.nojekyll` — harmless, included in case you ever mirror to GitHub.

## Step 1 — Apps Script

1. Open your Google Sheet.
2. Go to Extensions → Apps Script.
3. Replace Code.gs with the included `Code.gs` file.
4. Save.
5. Run `setupPortalDatabase` once.
6. Approve permissions.
7. Deploy → Manage deployments → Edit pencil → New version → Deploy.
8. Confirm this URL works in your browser:

https://script.google.com/macros/s/AKfycbxHibLCuGOMGcTsWPhev7IAjI1CVV8G5y5sQRDQlFRhp_jWVgjxU5UOyWGBgF7Bxh8L/exec

It should show JSON saying the API is running.

## Step 2 — Netlify

1. Go to Netlify.
2. Add new site.
3. Choose Deploy manually or drag-and-drop deploy.
4. Drag the entire folder `mcps_netlify_full_working_site` into Netlify.
5. Wait for deploy.
6. Open the Netlify website URL.

## Login

Admin:
Name: Antonio Siller
Access Code: 9981

Viewer test:
Name: Antonio Siller Viewer
Access Code: 9982

## Important

Do not open `index.html` locally from your computer for real testing. Use the Netlify website URL.

Do not mix this package with the old files. Replace everything with this package.
