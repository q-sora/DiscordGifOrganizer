# Discord GIF Organizer

A BetterDiscord plugin to organize, tag, and quickly send your favorite GIFs.

![Image](https://github.com/user-attachments/assets/055123da-56cc-4047-b659-76b58613e661)

## Features

- **Custom categories** — create color-coded categories to organize GIFs
- **Tag system** — add tags to GIFs for quick search and filtering
- **Save from chat** — hover over any GIF in chat and click the save button
- **One-click send** — click a GIF in your collection to instantly send it
- **NSFW blur** — tag GIFs as NSFW and toggle blur on/off
- **Search** — filter your collection by tags or URL
- **Export / Import** — backup and restore your GIF library as JSON
- **Tenor support** — saves both `tenor.com/view` URLs (for proper Discord embeds) and media URLs (for previews)
- **Auto language** — detects Discord language and switches between English and Russian

## Installation

1. Download [GifOrganizer.plugin.js](GifOrganizer.plugin.js)
2. Place it in your BetterDiscord plugins folder:
   - Windows: `%appdata%/BetterDiscord/plugins/`
   - macOS: `~/Library/Application Support/BetterDiscord/plugins/`
   - Linux: `~/.config/BetterDiscord/plugins/`
3. Enable the plugin in **Settings → Plugins**

## Usage

### Opening the panel
Click the 📁 icon in the message bar (next to GIF, emoji, and sticker buttons).

### Saving GIFs
- **From chat:** hover over any GIF and click the save icon in the top-right corner
- **Manually:** paste a GIF URL in the input field at the bottom of the panel

### Sending GIFs
Click any GIF in your collection — it will be pasted and sent automatically.

### Managing categories
Switch to the **Categories** tab to create, edit, or delete categories. Each category has a custom name and color.

### NSFW content
Check the **NSFW** box when saving a GIF to tag it. Toggle **Hide NSFW** in the panel to blur tagged GIFs.

## Screenshots

| Panel | Save from chat |
|-------|---------------|
| *GIF grid with categories and search* | *Save button on hover* |

## Built with

- Vanilla JavaScript (no frameworks)
- BetterDiscord API (`BdApi`)
- Inline SVG icons (no external dependencies)

## Author

**q_sora**
