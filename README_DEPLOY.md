# MCPS Portal Deployment

This folder must be deployed as a full Netlify project, not opened locally.

## Correct architecture

Frontend portal -> Netlify site
Netlify function -> Apps Script Web App /exec
Database -> Google Sheets
Files -> Google Drive

## Why you got the backend-function error

The portal calls this URL inside the same Netlify site:

/.netlify/functions/portal-api

That URL only exists after Netlify builds/deploys the `netlify/functions/portal-api.js` file.
If you open `index.html` locally or deploy only the HTML file, the function does not exist.

## Best deployment path

1. Create a GitHub repository.
2. Upload everything in this folder to the repository root.
3. In Netlify, choose Add new site -> Import from Git.
4. Pick your GitHub repo.
5. Netlify should read `netlify.toml`.
6. Build command: leave blank.
7. Publish directory: `.`
8. Deploy.

## Test function

After deploy, open:

https://YOUR-SITE.netlify.app/.netlify/functions/portal-api

You should see:

{ "success": true, "message": "Netlify function is live." }

Then open your site homepage and log in.

## Login

Admin:
Antonio Siller / 9981

Viewer test:
Antonio Siller Viewer / 9982

## Apps Script

Paste `Code.gs` into your Google Sheet Apps Script project. Then run:

setupPortalDatabase
repairCreatorAccess

Then deploy as Web App with:
Execute as: Me
Who has access: Anyone
