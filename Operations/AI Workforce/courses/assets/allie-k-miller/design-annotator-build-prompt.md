# Design Annotator — Build Prompt (Concise Version)

A shorter version of the design annotator prompt. Same tool, fewer words.

---

Build me a design annotation tool as a single HTML file that runs entirely in my browser — no server, no accounts, no external libraries.

I use it to give feedback on designs (website screenshots, app mockups, slides, graphics). I mark up an image with numbered comments, then export everything in a format I can hand to an AI assistant so it can make the changes.

Features:

1. **Upload:** Add one or more images by drag-and-drop, file picker, or pasting from the clipboard. Each image keeps its own annotations; let me switch between them.

2. **Annotate:** Click anywhere on the image to drop a numbered marker with a comment box. Markers can be dragged to reposition and deleted (renumber automatically). Also let me draw a circle around a larger region when feedback applies to a whole area.

3. **Comment panel:** A side panel lists all comments by number, synced with the markers — click one to highlight the other. Comments are editable.

4. **Export:** One button that produces:
- The annotated image as a PNG (markers baked in)
- A text summary for an AI assistant: each marker's number, its location in plain words ("top-right corner, on the navigation"), and my comment — with a copy-to-clipboard option

5. **Persistence:** Save everything to localStorage so nothing is lost if the tab closes. Include a "start new session" button.

Keep the tool's design clean and neutral, with markers that stay visible on both light and dark images. Keep the code simple and readable — I may ask an AI to modify it later.
