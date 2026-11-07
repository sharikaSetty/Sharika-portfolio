# Sharika: portfolio

Loader, hero and about sections. Plain HTML, CSS and JS, no build step.

## Run it
```bash
npx serve .          # or: python3 -m http.server 8000
```
Open it through a local server (not by double-clicking index.html) so the videos preload with real progress.

## Put it on GitHub
```bash
git init && git add . && git commit -m "Initial commit"
gh repo create sharika-portfolio --public --source=. --push
```
Then import the repo on vercel.com (framework preset: Other) to deploy.

## Edit the placeholders
Anything marked `data-edit` in `index.html` is placeholder copy or a placeholder link:
tagline, role pills, about paragraph, the three facts, the email address, the Work link.

## Media (in /assets)
- `loader.mp4`: plays once; the cup filling is the progress bar
- `hero.mp4`: plays after loading; the name appears as the clip ends
- `about.mp4` then `about-end.jpg`: the clip ends, the camera pulls back to the wider still, text appears
All clips are re-encoded at 1920x1080, lightly denoised, sharpened and brightened.
