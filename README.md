# New Hire Onboarding Course

A click-through onboarding course template. The structure follows a Coursera course: course page, module accordion, course home, a lesson player with a sidebar, knowledge checks, grades, and a certificate. The visual design uses Verato's design language: navy and mint palette, Noto Serif headlines with Roboto body text, a dark hero with a teal glow, "Where do you want to start?" pathway cards, numbered journey tabs, and a dark footer.

It's plain HTML, CSS and JavaScript. There's no build step and nothing to install.

## View it

From this folder, run:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. You can also double-click `index.html`. Everything works that way too, but some video embeds (YouTube) need the local server.

## Add your onboarding material

**Edit one file: [`content/course.js`](content/course.js).** Save it, then refresh the browser.

| What you want to change | Where in `course.js` |
| --- | --- |
| Company name, course title, tagline, logo | `settings` |
| Help contacts (the "Need help?" button) | `settings.helpContacts` |
| "What you'll learn", skills, About text | `overview` |
| "Where do you want to start?" cards | `pathways` |
| Numbered journey tabs (first week, 30/60/90) | `journey` |
| Onboarding team / buddies | `team` |
| FAQ | `faq` |
| Modules and lessons | `modules` |

### Lesson types

Each lesson has a `type`, `title` and optional `duration` (e.g. `"10 min"`). Module times are added up automatically.

- **`video`**: `videoUrl` takes a YouTube, Vimeo, Loom, Google Drive or `.mp4` link. With no link it shows a "coming soon" placeholder. `body` is optional notes.
- **`reading`**: `body` in Markdown.
- **`checklist`**: `items: ["Task one", "Task two"]`. It's marked complete when every box is ticked.
- **`resource`**: `links: [{ label, url, description }]`.
- **`quiz`**: `passingScore` (percent) and `questions: [{ q, options: [...], answer: <index starting at 0>, explanation }]`.

To add a module, copy an existing `{ title, description, objectives, lessons: [...] }` block and paste it into the `modules` list. To add a lesson, copy one lesson block.

### Markdown in `body` fields

```
## Heading            **bold**   *italic*   [link](https://...)
- bullet              1. numbered           > callout box
![alt text](content/images/picture.png)
<iframe src="..."></iframe>   ← raw HTML lines are passed through
```

Put images in `content/images/`.

### Re-branding

All colors and fonts are CSS variables at the top of [`assets/styles.css`](assets/styles.css) (`--navy`, `--mint`, `--font-heading`, …).

## Progress

Each learner's progress (completed items, checklist ticks, quiz scores) is saved in their own browser's local storage. It isn't shared between devices or reported to anyone. "Reset my progress" is on the Grades page. If you need completion tracking for managers, the next step is to host this on an LMS or add a small backend.

## Files

```
index.html          page shell
content/course.js   ← all course content (edit this)
content/images/     your images
assets/styles.css   design tokens + styles
assets/app.js       router, pages, progress, quizzes, Markdown
```
