# Talha Ashfaq — Multi-page Developer Portfolio

A no-photo, responsive, multi-page portfolio built with HTML, CSS and vanilla JavaScript. Includes animated hero choreography, typewriter role text, ambient gradient movement, a seamless ticker, staggered scroll reveals, academic progress animation, pointer spotlights, page transitions, and a reading progress bar.

## Included pages

- `index.html` — Home and academic snapshot
- `about.html` — About, education, semester progress and CGPA field
- `projects.html` — Three project profiles
- `experience.html` — Professional experience
- `contact.html` — Contact links and mailto-based message form

## Personal details

Profile information is centralized in `data.js`.

### Academic performance

The current CGPA displayed in the academic dashboard is `3.58`, as provided by Talha. It is stored in `data.js` and can be updated there when a newer university result is available. The value is shown without assuming a grading scale.

## Run the portfolio locally

From this folder, run:

```bash
python -m http.server 5500
```

Then open:

`http://127.0.0.1:5500`

A local server is recommended so navigation and project links behave consistently.

## Project demo notes

- Nova AI is a rule-based demonstration chat interface, not connected to a real AI API.
- AttendX is a browser-storage prototype, not a secure multi-user attendance platform.
- CareerLens uses keyword matching for an estimated compatibility score. It is not an official ATS score. Its local FastAPI service must be started separately; see `projects/career-lens/README.md`.

## Accuracy and privacy

- No profile photograph is used.
- No residential address or phone number is displayed.
- The displayed CGPA of 3.58 was supplied by Talha.
- Employment durations are shown as supplied; no unsupported employment dates or achievements are added.
- The progress graphic shows two completed semesters out of an eight-semester plan and the third semester as current. It does not estimate current-semester completion.

## License

The portfolio code in this package is original and provided for Talha Ashfaq to customize and use. Third-party dependencies are not bundled.
