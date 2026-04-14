/**
 * @name GifOrganizer
 * @author q_sora
 * @description Organize your favorite GIFs into custom categories and tag them for quick search.
 * @version 1.3.0
 */

module.exports = class GifOrganizer {
    getName() { return "GifOrganizer"; }    
    getAuthor() { return "q_sora"; }
    getVersion() { return "1.3.0"; }
    getDescription() { return "Organize your favorite GIFs into custom categories with tags for quick filtering and search."; }

    constructor() {
        this.categories = [];
        this.gifs = [];
        this.panel = null;
        this.observer = null;
        this.buttonInjected = false;
        this._currentTab = "gifs";
        this._searchQuery = "";
        this._selectedCat = null;
        this._hideNsfw = false;
    }

    // ───────────────────── SVG Icons ─────────────────────
    _icons = {
        folder: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
        export: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        import: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        send: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
        edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
        clipboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        save: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
        plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        inbox: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
        warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    };

    _icon(name) { return this._icons[name] || ""; }

    // ───────────────────── Storage ─────────────────────
    loadData(key, fallback) { return BdApi.Data.load("GifOrganizer", key) ?? fallback; }
    saveData(key, value) { BdApi.Data.save("GifOrganizer", key, value); }
    _persist() { this.saveData("categories", this.categories); this.saveData("gifs", this.gifs); }
    _id() { return Math.random().toString(36).slice(2, 10); }

    // ───────────────────── URL helpers ─────────────────────
    _normalizeGifUrl(url) {
        if (url.includes("discordapp.net/external/") || url.includes("discordapp.com/external/")) {
            try {
                const match = url.match(/\/external\/[^/]+\/(https?)\/(.*)/);
                if (match) url = match[1] + "://" + match[2];
            } catch {}
        }
        return url;
    }

    _getDisplayUrl(gif) {
        if (gif.previewUrl) return gif.previewUrl;
        if (gif.url.includes("tenor.com/view/")) return null;
        return gif.url;
    }

    // ───────────────────── Lifecycle ─────────────────────
    start() {
        this.categories = this.loadData("categories", [
            { id: this._id(), name: "Reactions", color: "#5865F2", gifIds: [] },
            { id: this._id(), name: "Memes", color: "#57F287", gifIds: [] },
            { id: this._id(), name: "Cute", color: "#FEE75C", gifIds: [] }
        ]);
        this.gifs = this.loadData("gifs", []);
        this._hideNsfw = this.loadData("hideNsfw", true);
        this._injectCSS();
        this._addGifPickerButton();
        this._startObserver();
        document.addEventListener("contextmenu", this._onContextMenu);
        BdApi.UI.showToast("GifOrganizer started!", { type: "success" });
    }

    stop() {
        this._removeCSS();
        this._removePanel();
        if (this.observer) { this.observer.disconnect(); this.observer = null; }
        document.querySelectorAll(".gif-org-launch-btn").forEach(el => el.remove());
        document.querySelectorAll(".gif-org-save-btn").forEach(el => el.remove());
        document.removeEventListener("contextmenu", this._onContextMenu);
        document.querySelectorAll(".gif-org-ctx").forEach(el => el.remove());
        this.buttonInjected = false;
    }

    // ───────────────────── CSS ─────────────────────
    _injectCSS() {
        BdApi.DOM.addStyle("GifOrganizer", `
            .gif-org-nsfw-row{display:flex;align-items:center;gap:8px;margin-top:10px;cursor:pointer;user-select:none}
            .gif-org-nsfw-row input{width:16px;height:16px;accent-color:#ED4245;cursor:pointer}
            .gif-org-nsfw-row span{color:var(--text-normal,#dbdee1);font-size:13px}
            .gif-org-save-btn{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.65);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:100;transition:background .15s,transform .1s;padding:0}
            .gif-org-save-btn:hover{background:rgba(0,0,0,.85);transform:scale(1.1)}
            .gif-org-save-btn svg{pointer-events:none}
            [class*="imageWrapper"]:hover .gif-org-save-btn,[class*="embedVideo"]:hover .gif-org-save-btn{display:flex}
            .gif-org-panel{position:fixed;bottom:55px;right:20px;width:480px;max-height:560px;background:var(--background-floating,#18191c);border:1px solid var(--background-modifier-accent,#2e3035);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.45);z-index:10000;display:flex;flex-direction:column;overflow:hidden;font-family:var(--font-primary,"gg sans","Noto Sans",sans-serif);animation:gifOrgSlideIn .2s ease-out}
            @keyframes gifOrgSlideIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
            .gif-org-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--background-modifier-accent,#2e3035);flex-shrink:0}
            .gif-org-header h3{margin:0;color:var(--header-primary,#fff);font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px}
            .gif-org-header h3 svg{flex-shrink:0}
            .gif-org-header-actions{display:flex;gap:6px}
            .gif-org-header-actions button{background:var(--background-secondary,#2b2d31);border:none;color:var(--interactive-normal,#b5bac1);padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;transition:background .15s,color .15s;display:flex;align-items:center;gap:4px}
            .gif-org-header-actions button:hover{background:var(--background-modifier-hover,#36373d);color:var(--interactive-hover,#dbdee1)}
            .gif-org-header-actions button svg{flex-shrink:0}
            .gif-org-tabs{display:flex;padding:0 12px;border-bottom:1px solid var(--background-modifier-accent,#2e3035);flex-shrink:0}
            .gif-org-tab{padding:8px 14px;font-size:13px;font-weight:600;color:var(--interactive-normal,#b5bac1);cursor:pointer;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;user-select:none}
            .gif-org-tab:hover{color:var(--interactive-hover,#dbdee1)}
            .gif-org-tab.active{color:var(--header-primary,#fff);border-bottom-color:var(--brand-500,#5865F2)}
            .gif-org-search{padding:10px 14px;flex-shrink:0}
            .gif-org-search-wrap{position:relative;display:flex;align-items:center}
            .gif-org-search-wrap svg{position:absolute;left:10px;color:var(--text-muted,#6d6f78);pointer-events:none}
            .gif-org-search input{width:100%;background:var(--background-secondary,#2b2d31);border:1px solid var(--background-modifier-accent,#3f4147);color:var(--text-normal,#dbdee1);padding:8px 12px 8px 32px;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .15s}
            .gif-org-search input:focus{border-color:var(--brand-500,#5865F2)}
            .gif-org-search input::placeholder{color:var(--text-muted,#6d6f78)}
            .gif-org-body{flex:1;overflow-y:auto;padding:10px 14px 14px;scrollbar-width:thin;scrollbar-color:var(--background-modifier-accent) transparent}
            .gif-org-cats{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
            .gif-org-cat-chip{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;user-select:none;transition:filter .15s,transform .1s;border:2px solid transparent}
            .gif-org-cat-chip:hover{filter:brightness(1.15);transform:scale(1.04)}
            .gif-org-cat-chip.selected{border-color:#fff}
            .gif-org-cat-chip .gif-org-cat-count{background:rgba(0,0,0,.3);padding:1px 6px;border-radius:8px;font-size:10px}
            .gif-org-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
            .gif-org-grid-item{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer;background:var(--background-secondary,#2b2d31)}
            .gif-org-grid-item img,.gif-org-grid-item video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .2s}
            .gif-org-grid-item:hover img,.gif-org-grid-item:hover video{transform:scale(1.08)}
            .gif-org-grid-item .gif-org-overlay{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.75));opacity:0;transition:opacity .15s;display:flex;flex-direction:column;justify-content:flex-end;padding:6px}
            .gif-org-grid-item:hover .gif-org-overlay{opacity:1}
            .gif-org-overlay .gif-org-tags-display{display:flex;flex-wrap:wrap;gap:3px}
            .gif-org-tag-mini{background:rgba(255,255,255,.18);color:#fff;padding:1px 6px;border-radius:4px;font-size:10px}
            .gif-org-overlay-actions{position:absolute;top:4px;right:4px;display:flex;gap:4px}
            .gif-org-overlay-actions button{background:rgba(0,0,0,.55);border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:background .15s}
            .gif-org-overlay-actions button svg{pointer-events:none}
            .gif-org-overlay-actions button:hover{background:rgba(0,0,0,.8)}
            .gif-org-add-form{padding:12px 14px;border-top:1px solid var(--background-modifier-accent,#2e3035);flex-shrink:0}
            .gif-org-add-form .gif-org-form-row{display:flex;gap:6px;margin-bottom:6px}
            .gif-org-add-form input,.gif-org-add-form select{flex:1;background:var(--background-secondary,#2b2d31);border:1px solid var(--background-modifier-accent,#3f4147);color:var(--text-normal,#dbdee1);padding:7px 10px;border-radius:6px;font-size:12px;outline:none;box-sizing:border-box}
            .gif-org-add-form select{max-width:140px}
            .gif-org-add-form select option{background:var(--background-secondary,#2b2d31)}
            .gif-org-add-form button{background:var(--brand-500,#5865F2);color:#fff;border:none;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:background .15s;white-space:nowrap;display:flex;align-items:center;gap:4px}
            .gif-org-add-form button:hover{background:var(--brand-560,#4752C4)}
            .gif-org-add-form button svg{flex-shrink:0}
            .gif-org-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10001;display:flex;align-items:center;justify-content:center;animation:gifOrgFadeIn .15s}
            @keyframes gifOrgFadeIn{from{opacity:0}to{opacity:1}}
            .gif-org-modal{background:var(--background-floating,#18191c);border-radius:12px;padding:20px;width:380px;max-width:90vw;box-shadow:0 12px 40px rgba(0,0,0,.5)}
            .gif-org-modal h4{margin:0 0 14px;color:var(--header-primary,#fff);font-size:16px;display:flex;align-items:center;gap:8px}
            .gif-org-modal h4 svg{flex-shrink:0}
            .gif-org-modal label{display:block;color:var(--text-muted,#b5bac1);font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:4px;margin-top:10px}
            .gif-org-modal input,.gif-org-modal select{width:100%;background:var(--background-secondary,#2b2d31);border:1px solid var(--background-modifier-accent,#3f4147);color:var(--text-normal,#dbdee1);padding:8px 12px;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box}
            .gif-org-modal select option{background:var(--background-secondary,#2b2d31)}
            .gif-org-modal-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
            .gif-org-modal-btns button{border:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
            .gif-org-btn-cancel{background:var(--background-secondary,#2b2d31);color:var(--text-normal,#dbdee1)}
            .gif-org-btn-confirm{background:var(--brand-500,#5865F2);color:#fff}
            .gif-org-color-row{display:flex;gap:6px;margin-top:4px}
            .gif-org-color-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:border-color .15s,transform .1s}
            .gif-org-color-swatch:hover{transform:scale(1.15)}
            .gif-org-color-swatch.selected{border-color:#fff}
            .gif-org-tag-edit-list{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
            .gif-org-tag-badge{background:var(--background-secondary,#2b2d31);color:var(--text-normal,#dbdee1);padding:3px 8px;border-radius:10px;font-size:11px;display:flex;align-items:center;gap:4px}
            .gif-org-tag-badge .remove{cursor:pointer;opacity:.5;font-size:12px}
            .gif-org-tag-badge .remove:hover{opacity:1}
            .gif-org-empty{text-align:center;padding:30px 20px;color:var(--text-muted,#6d6f78);font-size:13px}
            .gif-org-empty svg{margin-bottom:8px;opacity:.5}
            .gif-org-launch-btn{background:none;border:none;color:var(--interactive-normal,#b5bac1);cursor:pointer;padding:4px 8px;border-radius:4px;transition:color .15s;display:flex;align-items:center}
            .gif-org-launch-btn:hover{color:var(--interactive-hover,#dbdee1)}
            .gif-org-ctx{position:fixed;background:var(--background-floating,#18191c);border:1px solid var(--background-modifier-accent,#2e3035);border-radius:8px;padding:6px;z-index:10002;min-width:220px;box-shadow:0 8px 24px rgba(0,0,0,.4)}
            .gif-org-ctx-item{padding:8px 10px;border-radius:4px;font-size:13px;color:var(--text-normal,#dbdee1);cursor:pointer;display:flex;align-items:center;gap:8px}
            .gif-org-ctx-item:hover{background:var(--background-modifier-hover,#36373d)}
            .gif-org-ctx-item svg{flex-shrink:0}
            .gif-org-no-preview{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted,#6d6f78);font-size:11px;text-align:center;padding:8px}
            .gif-org-nsfw-row{display:flex;align-items:center;gap:8px;margin-top:6px;cursor:pointer;user-select:none}
            .gif-org-nsfw-row input[type="checkbox"]{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid var(--interactive-normal,#b5bac1);border-radius:4px;cursor:pointer;position:relative;transition:background .15s,border-color .15s;flex-shrink:0}
            .gif-org-nsfw-row input[type="checkbox"]:checked{background:var(--brand-500,#5865F2);border-color:var(--brand-500,#5865F2)}
            .gif-org-nsfw-row input[type="checkbox"]:checked::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:12px;font-weight:700}
            .gif-org-nsfw-row input[type="checkbox"]:hover{border-color:var(--interactive-hover,#dbdee1)}
            .gif-org-nsfw-row span{color:var(--text-normal,#dbdee1);font-size:13px;font-weight:600}
            .gif-org-grid-item.nsfw-blur img,.gif-org-grid-item.nsfw-blur video{filter:blur(12px);transition:filter .2s,transform .2s}
            .gif-org-grid-item.nsfw-blur:hover img,.gif-org-grid-item.nsfw-blur:hover video{filter:blur(6px);transform:scale(1.08)}
        `);
    }

    _removeCSS() { BdApi.DOM.removeStyle("GifOrganizer"); }

    // ───────────────────── Observer ─────────────────────
    _startObserver() {
        this.observer = new MutationObserver(() => {
            if (!document.querySelector(".gif-org-launch-btn")) {
                this.buttonInjected = false;
                this._addGifPickerButton();
            }
            this._injectSaveButtons();
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    // ───────────────────── Inject launch button ─────────────────────
    _addGifPickerButton() {
        if (this.buttonInjected) return;
        const buttonsBar = document.querySelector('[class*="channelTextArea_"] [class*="buttons_"]');
        if (!buttonsBar) return;
        const btn = document.createElement("button");
        btn.className = "gif-org-launch-btn";
        btn.title = "GIF Organizer";
        btn.innerHTML = this._icon("folder");
        btn.addEventListener("click", () => this._togglePanel());
        buttonsBar.appendChild(btn);
        this.buttonInjected = true;
    }

    // ───────────────────── Save buttons on chat GIFs ─────────────────────
    _injectSaveButtons() {
        // GIF-ки через пикер (есть originalLink)
        document.querySelectorAll('a[class*="originalLink"]:not([data-gif-org-btn])').forEach(link => {
            link.setAttribute("data-gif-org-btn", "true");
            const wrapper = link.closest('[class*="imageWrapper"]');
            if (!wrapper) return;
            wrapper.style.position = "relative";
            const btn = document.createElement("button");
            btn.className = "gif-org-save-btn";
            btn.title = "Сохранить в GIF Organizer";
            btn.innerHTML = this._icon("save");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const viewUrl = link.getAttribute("href");
                const mediaUrl = wrapper.querySelector("img")?.getAttribute("data-safe-src")
                    || wrapper.querySelector("img")?.src
                    || wrapper.querySelector("video")?.src;
                this._quickAddModal(viewUrl || mediaUrl, mediaUrl);
            });
            wrapper.appendChild(btn);
        });

        // Медиа без originalLink
        document.querySelectorAll(
            '[class*="imageWrapper"] img[src*="tenor.com"]:not([data-gif-org-btn]),' +
            '[class*="imageWrapper"] img[src*="giphy.com"]:not([data-gif-org-btn]),' +
            '[class*="embedVideo"] video[src*="tenor.com"]:not([data-gif-org-btn]),' +
            '[class*="embedVideo"] video[src*=".gif"]:not([data-gif-org-btn])'
        ).forEach(media => {
            media.setAttribute("data-gif-org-btn", "true");
            const wrapper = media.closest('[class*="imageWrapper"], [class*="embedVideo"]');
            if (!wrapper || wrapper.querySelector(".gif-org-save-btn")) return;
            wrapper.style.position = "relative";
            const btn = document.createElement("button");
            btn.className = "gif-org-save-btn";
            btn.title = "Сохранить в GIF Organizer";
            btn.innerHTML = this._icon("save");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parentLink = wrapper.querySelector('a[class*="originalLink"]');
                const viewUrl = parentLink?.getAttribute("href");
                const mediaUrl = media.src;
                this._quickAddModal(viewUrl || mediaUrl, mediaUrl);
            });
            wrapper.appendChild(btn);
        });
    }

    // ───────────────────── Panel ─────────────────────
    _togglePanel() { if (this.panel) this._removePanel(); else this._openPanel(); }
    _removePanel() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
        if (this._panelEsc) {
            document.removeEventListener("keydown", this._panelEsc, true);
            this._panelEsc = null;
        }
        if (this._panelClick) {
            document.removeEventListener("mousedown", this._panelClick);
            this._panelClick = null;
        }
    }

    _openPanel() {
        this._removePanel();
        this.panel = document.createElement("div");
        this.panel.className = "gif-org-panel";
        this._currentTab = "gifs";
        this._searchQuery = "";
        this._selectedCat = null;
        this._renderPanel();
        document.body.appendChild(this.panel);

        // Закрытие по Esc
        this._panelEsc = (ev) => {
            if (ev.key === "Escape") this._removePanel();
        };
        document.addEventListener("keydown", this._panelEsc, true);

        // Закрытие по клику вне панели
        setTimeout(() => {
            this._panelClick = (ev) => {
                if (this.panel
                    && !this.panel.contains(ev.target)
                    && !ev.target.closest(".gif-org-panel")
                    && !ev.target.closest(".gif-org-launch-btn")
                    && !ev.target.closest(".gif-org-modal-backdrop")) {
                    this._removePanel();
                }
            };          
            document.addEventListener("mousedown", this._panelClick);
        }, 10);
    }

    _renderPanel() {
        if (!this.panel) return;
        const tab = this._currentTab;
        this.panel.innerHTML = "";

        const header = this._el("div", "gif-org-header");
        const title = this._el("h3");
        title.innerHTML = this._icon("folder") + " GIF Organizer";
        const actions = this._el("div", "gif-org-header-actions");
        const exportBtn = this._el("button");
        exportBtn.innerHTML = this._icon("export") + " Export";
        exportBtn.onclick = () => this._exportData();
        const importBtn = this._el("button");
        importBtn.innerHTML = this._icon("import") + " Import";
        importBtn.onclick = () => this._importData();
        const closeBtn = this._el("button");
        closeBtn.innerHTML = this._icon("close");
        closeBtn.onclick = () => this._removePanel();
        actions.append(exportBtn, importBtn, closeBtn);
        header.append(title, actions);
        this.panel.append(header);

        const tabs = this._el("div", "gif-org-tabs");
        [["gifs", "GIF-ки"], ["categories", "Категории"]].forEach(([key, label]) => {
            const t = this._el("div", `gif-org-tab${tab === key ? " active" : ""}`, label);
            t.onclick = () => { this._currentTab = key; this._renderPanel(); };
            tabs.append(t);
        });
        this.panel.append(tabs);

        if (tab === "gifs") this._renderGifsTab();
        else this._renderCategoriesTab();
    }

    _renderGifsTab() {
        // Hide NSFW toggle
        const nsfwToggleRow = this._el("div", "gif-org-nsfw-row");
        nsfwToggleRow.style.padding = "0 14px";
        nsfwToggleRow.style.marginBottom = "4px";
        const nsfwToggle = document.createElement("input");
        nsfwToggle.type = "checkbox";
        nsfwToggle.checked = this._hideNsfw;
        const nsfwToggleLabel = this._el("span", "", "Скрывать NSFW");
        nsfwToggleRow.onclick = (e) => {
            if (e.target !== nsfwToggle) nsfwToggle.checked = !nsfwToggle.checked;
            this._hideNsfw = nsfwToggle.checked;
            this.saveData("hideNsfw", this._hideNsfw);
            this._renderGifGrid();
        };
        nsfwToggleRow.append(nsfwToggle, nsfwToggleLabel);
        this.panel.append(nsfwToggleRow);

        const search = this._el("div", "gif-org-search");
        const searchWrap = this._el("div", "gif-org-search-wrap");
        searchWrap.innerHTML = this._icon("search");
        const input = document.createElement("input");
        input.placeholder = "Поиск по тегам или URL...";
        input.value = this._searchQuery;
        input.oninput = (e) => { this._searchQuery = e.target.value; this._renderGifGrid(); };
        searchWrap.append(input);
        search.append(searchWrap);
        this.panel.append(search);

        const catsRow = this._el("div", "gif-org-cats");
        catsRow.style.padding = "0 14px";
        const allChip = this._el("div", `gif-org-cat-chip${this._selectedCat === null ? " selected" : ""}`);
        allChip.style.background = "var(--background-secondary, #2b2d31)";
        allChip.style.color = "var(--text-normal, #dbdee1)";
        allChip.innerHTML = `Все <span class="gif-org-cat-count">${this.gifs.length}</span>`;
        allChip.onclick = () => { this._selectedCat = null; this._renderPanel(); };
        catsRow.append(allChip);
        this.categories.forEach(cat => {
            const count = this.gifs.filter(g => g.categoryId === cat.id).length;
            const chip = this._el("div", `gif-org-cat-chip${this._selectedCat === cat.id ? " selected" : ""}`);
            chip.style.background = cat.color + "33";
            chip.style.color = cat.color;
            chip.innerHTML = `${this._esc(cat.name)} <span class="gif-org-cat-count">${count}</span>`;
            chip.onclick = () => { this._selectedCat = cat.id; this._renderPanel(); };
            catsRow.append(chip);
        });
        this.panel.append(catsRow);

        const body = this._el("div", "gif-org-body");
        body.id = "gif-org-grid-container";
        this.panel.append(body);
        requestAnimationFrame(() => this._renderGifGrid());

        const form = this._el("div", "gif-org-add-form");
        const row1 = this._el("div", "gif-org-form-row");
        const urlInput = document.createElement("input");
        urlInput.placeholder = "URL гифки (tenor, giphy...)";
        urlInput.id = "gif-org-url-input";
        row1.append(urlInput);
        form.append(row1);
        const row2 = this._el("div", "gif-org-form-row");
        const tagInput = document.createElement("input");
        tagInput.placeholder = "Теги через запятую";
        tagInput.id = "gif-org-tag-input";
        const catSelect = document.createElement("select");
        catSelect.id = "gif-org-cat-select";
        const defOpt = document.createElement("option");
        defOpt.value = ""; defOpt.textContent = "Без категории";
        catSelect.append(defOpt);
        this.categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id; opt.textContent = cat.name;
            catSelect.append(opt);
        });
        const addBtn = this._el("button");
        addBtn.innerHTML = this._icon("plus") + " Добавить";
        addBtn.onclick = () => this._addGif();

        row2.append(tagInput, catSelect, addBtn);
        form.append(row2);
        this.panel.append(form);
    }

    _renderGifGrid() {
        const container = document.getElementById("gif-org-grid-container");
        if (!container) return;
        container.innerHTML = "";

        let filtered = [...this.gifs];
        if (this._selectedCat) filtered = filtered.filter(g => g.categoryId === this._selectedCat);
        if (this._searchQuery.trim()) {
            const q = this._searchQuery.toLowerCase();
            filtered = filtered.filter(g =>
                g.tags.some(t => t.toLowerCase().includes(q)) || g.url.toLowerCase().includes(q)
            );
        }

        if (!filtered.length) {
            const empty = this._el("div", "gif-org-empty");
            empty.innerHTML = this._icon("inbox") + '<div style="margin-top:4px">Нет гифок. Добавьте свою первую!</div>';
            container.append(empty);
            return;
        }

        const grid = this._el("div", "gif-org-grid");
        filtered.forEach(gif => {
            const item = this._el("div", "gif-org-grid-item");
            const displayUrl = this._getDisplayUrl(gif);

            if (displayUrl) {
                if (displayUrl.includes(".mp4") || displayUrl.includes(".webm")) {
                    const video = document.createElement("video");
                    video.src = displayUrl;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.onerror = () => { video.style.display = "none"; };
                    item.append(video);
                    if (this._hideNsfw && gif.tags.some(t => t.toLowerCase() === "nsfw")) {
                        item.classList.add("nsfw-blur");
                    }
                } else {
                    const img = document.createElement("img");
                    img.src = displayUrl;
                    img.alt = gif.tags.join(", ");
                    img.loading = "lazy";
                    img.onerror = () => { img.style.display = "none"; };
                    item.append(img);
                    if (this._hideNsfw && gif.tags.some(t => t.toLowerCase() === "nsfw")) {
                        item.classList.add("nsfw-blur");
                    }
                }
            } else {
                const noPreview = this._el("div", "gif-org-no-preview");
                const slug = gif.url.match(/\/([^/]+)\/?$/)?.[1] || "GIF";
                noPreview.textContent = slug.replace(/-/g, " ").substring(0, 30);
                item.append(noPreview);
            }

            const overlay = this._el("div", "gif-org-overlay");
            const tagsDisp = this._el("div", "gif-org-tags-display");
            gif.tags.slice(0, 4).forEach(t => {
                tagsDisp.append(this._el("span", "gif-org-tag-mini", "#" + t));
            });
            overlay.append(tagsDisp);

            const oActions = this._el("div", "gif-org-overlay-actions");
            const sendBtn = this._el("button");
            sendBtn.title = "Вставить в чат";
            sendBtn.innerHTML = this._icon("send");
            sendBtn.onclick = (e) => { e.stopPropagation(); this._sendGif(gif); };
            const editBtn = this._el("button");
            editBtn.title = "Редактировать";
            editBtn.innerHTML = this._icon("edit");
            editBtn.onclick = (e) => { e.stopPropagation(); this._editGifModal(gif); };
            const delBtn = this._el("button");
            delBtn.title = "Удалить";
            delBtn.innerHTML = this._icon("trash");
            delBtn.onclick = (e) => { e.stopPropagation(); this._deleteGif(gif.id); };
            oActions.append(sendBtn, editBtn, delBtn);
            overlay.append(oActions);

            item.append(overlay);
            item.onclick = () => this._sendGif(gif);
            grid.append(item);
        });
        container.append(grid);
    }

    _renderCategoriesTab() {
        const body = this._el("div", "gif-org-body");
        this.categories.forEach(cat => {
            const count = this.gifs.filter(g => g.categoryId === cat.id).length;
            const row = this._el("div", "");
            row.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;margin-bottom:6px;background:var(--background-secondary,#2b2d31);";
            const dot = this._el("div", "");
            dot.style.cssText = "width:14px;height:14px;border-radius:50%;background:" + cat.color + ";flex-shrink:0;";
            const name = this._el("span", "");
            name.style.cssText = "flex:1;color:var(--text-normal);font-size:14px;font-weight:600;";
            name.textContent = cat.name + " (" + count + ")";
            const editBtn = this._el("button", "");
            editBtn.style.cssText = "background:none;border:none;cursor:pointer;color:var(--interactive-normal);display:flex;align-items:center;padding:4px;border-radius:4px;transition:color .15s;";
            editBtn.innerHTML = this._icon("edit");
            editBtn.onmouseenter = () => { editBtn.style.color = "var(--interactive-hover)"; };
            editBtn.onmouseleave = () => { editBtn.style.color = "var(--interactive-normal)"; };
            editBtn.onclick = () => this._editCategoryModal(cat);
            const delBtn = this._el("button", "");
            delBtn.style.cssText = "background:none;border:none;cursor:pointer;color:var(--interactive-normal);display:flex;align-items:center;padding:4px;border-radius:4px;transition:color .15s;";
            delBtn.innerHTML = this._icon("trash");
            delBtn.onmouseenter = () => { delBtn.style.color = "#ED4245"; };
            delBtn.onmouseleave = () => { delBtn.style.color = "var(--interactive-normal)"; };
            delBtn.onclick = () => this._deleteCategory(cat.id);
            row.append(dot, name, editBtn, delBtn);
            body.append(row);
        });

        const addRow = this._el("div", "");
        addRow.style.cssText = "display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:8px;margin-top:8px;border:2px dashed var(--background-modifier-accent,#3f4147);color:var(--text-muted);font-size:13px;cursor:pointer;transition:border-color .15s,color .15s;";
        addRow.innerHTML = this._icon("plus") + " Новая категория";
        addRow.onmouseenter = () => { addRow.style.borderColor = "var(--brand-500)"; addRow.style.color = "var(--text-normal)"; };
        addRow.onmouseleave = () => { addRow.style.borderColor = "var(--background-modifier-accent)"; addRow.style.color = "var(--text-muted)"; };
        addRow.onclick = () => this._editCategoryModal(null);
        body.append(addRow);
        this.panel.append(body);
    }

    // ───────────────────── CRUD ─────────────────────
    _addGif() {
        const url = document.getElementById("gif-org-url-input")?.value?.trim();
        const tagsRaw = document.getElementById("gif-org-tag-input")?.value?.trim();
        const catId = document.getElementById("gif-org-cat-select")?.value;
        if (!url) return BdApi.UI.showToast("Введите URL гифки!", { type: "error" });
        const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
        const nsfwChecked = document.getElementById("gif-org-nsfw-form-check")?.checked;
        if (nsfwChecked && !tags.includes("nsfw")) tags.push("nsfw");
        const gif = { id: this._id(), url: this._normalizeGifUrl(url), previewUrl: null, tags, categoryId: catId || null, addedAt: Date.now() };
        this.gifs.push(gif);
        if (catId) {
            const cat = this.categories.find(c => c.id === catId);
            if (cat) cat.gifIds.push(gif.id);
        }
        this._persist();
        BdApi.UI.showToast("GIF добавлена!", { type: "success" });
        this._renderPanel();
    }

    _deleteGif(id) {
        this.gifs = this.gifs.filter(g => g.id !== id);
        this.categories.forEach(c => c.gifIds = c.gifIds.filter(gid => gid !== id));
        this._persist();
        this._renderGifGrid();
    }

    _deleteCategory(id) {
        this.categories = this.categories.filter(c => c.id !== id);
        this.gifs.forEach(g => { if (g.categoryId === id) g.categoryId = null; });
        this._persist();
        BdApi.UI.showToast("Категория удалена", { type: "info" });
        this._renderPanel();
    }

    _sendGif(gif) {
        let url = gif.url;
        if (url.includes("discordapp.net/external/") || url.includes("discordapp.com/external/")) {
            try {
                const match = url.match(/\/external\/[^/]+\/(https?)\/(.*)/);
                if (match) url = match[1] + "://" + match[2];
            } catch {}
        }

        const editor = document.querySelector('[role="textbox"]');
        if (editor) {
            editor.focus();
            const inputEvent = new InputEvent("beforeinput", {
                inputType: "insertText",
                data: url,
                bubbles: true,
                cancelable: true,
            });
            editor.dispatchEvent(inputEvent);
            setTimeout(() => {
                editor.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true,
                }));
            }, 100);
            this._removePanel();
        } else {
            navigator.clipboard.writeText(url);
            BdApi.UI.showToast("URL скопирован!", { type: "success" });
            this._removePanel();
        }
    }

    // ───────────────────── Modals ─────────────────────
    _quickAddModal(url, previewUrl) {
        const backdrop = this._el("div", "gif-org-modal-backdrop");
        const modal = this._el("div", "gif-org-modal");
        const heading = this._el("h4");
        heading.innerHTML = this._icon("save") + " Сохранить GIF";
        modal.append(heading);

        const previewSrc = previewUrl || url;
        if (previewSrc.includes(".mp4") || previewSrc.includes(".webm")) {
            const video = document.createElement("video");
            video.src = previewSrc;
            video.autoplay = true; video.loop = true; video.muted = true;
            video.style.cssText = "width:100%;max-height:180px;object-fit:contain;border-radius:8px;margin-bottom:12px;background:var(--background-secondary);";
            modal.append(video);
        } else if (!previewSrc.includes("tenor.com/view/")) {
            const preview = document.createElement("img");
            preview.src = previewSrc;
            preview.style.cssText = "width:100%;max-height:180px;object-fit:contain;border-radius:8px;margin-bottom:12px;background:var(--background-secondary);";
            modal.append(preview);
        }

        modal.append(this._el("label", "", "Категория"));
        const catSelect = document.createElement("select");
        const noneOpt = document.createElement("option");
        noneOpt.value = ""; noneOpt.textContent = "Без категории";
        catSelect.append(noneOpt);
        this.categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id; opt.textContent = cat.name;
            catSelect.append(opt);
        });
        modal.append(catSelect);

        modal.append(this._el("label", "", "Теги"));
        const tagInput = document.createElement("input");
        tagInput.placeholder = "Теги через запятую";
        modal.append(tagInput);

        // NSFW checkbox
        const nsfwRow = this._el("div", "gif-org-nsfw-row");
        const nsfwCheck = document.createElement("input");
        nsfwCheck.type = "checkbox";
        nsfwCheck.id = "gif-org-nsfw-check";
        const nsfwLabel = this._el("span", "", "NSFW");
        nsfwRow.onclick = (e) => { if (e.target !== nsfwCheck) nsfwCheck.checked = !nsfwCheck.checked; };
        nsfwRow.append(nsfwCheck, nsfwLabel);
        modal.append(nsfwRow);

        const btns = this._el("div", "gif-org-modal-btns");
        const cancelBtn = this._el("button", "gif-org-btn-cancel", "Отмена");
        cancelBtn.onclick = () => backdrop.remove();
        const saveBtn = this._el("button", "gif-org-btn-confirm", "Сохранить");
        saveBtn.onclick = () => {
            const tags = tagInput.value.split(",").map(t => t.trim()).filter(Boolean);
            if (nsfwCheck.checked && !tags.includes("nsfw")) tags.push("nsfw");
            const catId = catSelect.value || null;
            const gif = {
                id: this._id(),
                url: this._normalizeGifUrl(url),
                previewUrl: previewUrl ? this._normalizeGifUrl(previewUrl) : null,
                tags, categoryId: catId, addedAt: Date.now()
            };
            this.gifs.push(gif);
            if (catId) {
                const cat = this.categories.find(c => c.id === catId);
                if (cat) cat.gifIds.push(gif.id);
            }
            this._persist();
            backdrop.remove();
            BdApi.UI.showToast("GIF сохранена!", { type: "success" });
        };
        btns.append(cancelBtn, saveBtn);
        modal.append(btns);

        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
        backdrop.append(modal);
        document.body.append(backdrop);
        const escClose = (ev) => {
            if (ev.key === "Escape") { backdrop.remove(); document.removeEventListener("keydown", escClose, true); }
        };
        document.addEventListener("keydown", escClose, true);
    }

    _editGifModal(gif) {
        const backdrop = this._el("div", "gif-org-modal-backdrop");
        const modal = this._el("div", "gif-org-modal");
        const heading = this._el("h4");
        heading.innerHTML = this._icon("edit") + " Редактировать GIF";
        modal.append(heading);

        modal.append(this._el("label", "", "Категория"));
        const catSelect = document.createElement("select");
        const noneOpt = document.createElement("option");
        noneOpt.value = ""; noneOpt.textContent = "Без категории";
        catSelect.append(noneOpt);
        this.categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id; opt.textContent = cat.name;
            if (gif.categoryId === cat.id) opt.selected = true;
            catSelect.append(opt);
        });
        modal.append(catSelect);

        modal.append(this._el("label", "", "Теги"));
        const tagInput = document.createElement("input");
        tagInput.value = gif.tags.join(", ");
        tagInput.placeholder = "happy, reaction, лол";
        modal.append(tagInput);

        let currentTags = [...gif.tags];
        const tagList = this._el("div", "gif-org-tag-edit-list");
        const renderTags = () => {
            tagList.innerHTML = "";
            currentTags.forEach((t, i) => {
                const badge = this._el("span", "gif-org-tag-badge");
                badge.innerHTML = "#" + this._esc(t) + ' <span class="remove">\u2715</span>';
                badge.querySelector(".remove").onclick = () => {
                    currentTags.splice(i, 1);
                    tagInput.value = currentTags.join(", ");
                    renderTags();
                };
                tagList.append(badge);
            });
        };
        tagInput.oninput = () => {
            currentTags = tagInput.value.split(",").map(t => t.trim()).filter(Boolean);
            renderTags();
        };
        renderTags();
        modal.append(tagList);

        const btns = this._el("div", "gif-org-modal-btns");
        const cancelBtn = this._el("button", "gif-org-btn-cancel", "Отмена");
        cancelBtn.onclick = () => backdrop.remove();
        const saveBtn = this._el("button", "gif-org-btn-confirm", "Сохранить");
        saveBtn.onclick = () => {
            gif.categoryId = catSelect.value || null;
            gif.tags = currentTags;
            this.categories.forEach(c => {
                c.gifIds = c.gifIds.filter(id => id !== gif.id);
                if (c.id === gif.categoryId) c.gifIds.push(gif.id);
            });
            this._persist();
            backdrop.remove();
            this._renderPanel();
            BdApi.UI.showToast("GIF обновлена!", { type: "success" });
        };
        btns.append(cancelBtn, saveBtn);
        modal.append(btns);

        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
        backdrop.append(modal);
        document.body.append(backdrop);
        const escClose = (ev) => {
            if (ev.key === "Escape") { backdrop.remove(); document.removeEventListener("keydown", escClose, true); }
        };
        document.addEventListener("keydown", escClose, true);
    }

    _editCategoryModal(cat) {
        const COLORS = ["#5865F2","#57F287","#FEE75C","#EB459E","#ED4245","#F47B67","#E8A8FF","#45DDC0","#FF9B2F","#2DC7C7"];
        const isNew = !cat;
        let color = cat ? cat.color : COLORS[0];

        const backdrop = this._el("div", "gif-org-modal-backdrop");
        const modal = this._el("div", "gif-org-modal");
        const heading = this._el("h4");
        heading.innerHTML = this._icon(isNew ? "plus" : "edit") + (isNew ? " Новая категория" : " Редактировать");
        modal.append(heading);

        modal.append(this._el("label", "", "Название"));
        const nameInput = document.createElement("input");
        nameInput.value = cat ? cat.name : "";
        nameInput.placeholder = "Название категории";
        modal.append(nameInput);

        modal.append(this._el("label", "", "Цвет"));
        const colorRow = this._el("div", "gif-org-color-row");
        COLORS.forEach(c => {
            const swatch = this._el("div", "gif-org-color-swatch" + (c === color ? " selected" : ""));
            swatch.style.background = c;
            swatch.onclick = () => {
                color = c;
                colorRow.querySelectorAll(".gif-org-color-swatch").forEach(s => s.classList.remove("selected"));
                swatch.classList.add("selected");
            };
            colorRow.append(swatch);
        });
        modal.append(colorRow);

        const btns = this._el("div", "gif-org-modal-btns");
        const cancelBtn = this._el("button", "gif-org-btn-cancel", "Отмена");
        cancelBtn.onclick = () => backdrop.remove();
        const saveBtn = this._el("button", "gif-org-btn-confirm", isNew ? "Создать" : "Сохранить");
        saveBtn.onclick = () => {
            const n = nameInput.value.trim();
            if (!n) return BdApi.UI.showToast("Введите название!", { type: "error" });
            if (isNew) this.categories.push({ id: this._id(), name: n, color, gifIds: [] });
            else { cat.name = n; cat.color = color; }
            this._persist();
            backdrop.remove();
            this._renderPanel();
            BdApi.UI.showToast(isNew ? "Категория создана!" : "Обновлено!", { type: "success" });
        };
        btns.append(cancelBtn, saveBtn);
        modal.append(btns);

        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
        backdrop.append(modal);
        document.body.append(backdrop);
        const escClose = (ev) => {
            if (ev.key === "Escape") { backdrop.remove(); document.removeEventListener("keydown", escClose, true); }
        };
        document.addEventListener("keydown", escClose, true);
    }

    // ───────────────────── Export / Import ─────────────────────
    _exportData() {
        const data = JSON.stringify({ categories: this.categories, gifs: this.gifs }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "gif-organizer-backup.json"; a.click();
        URL.revokeObjectURL(url);
        BdApi.UI.showToast("Экспорт готов!", { type: "success" });
    }

    _importData() {
        const input = document.createElement("input");
        input.type = "file"; input.accept = ".json";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (data.categories) this.categories = data.categories;
                    if (data.gifs) this.gifs = data.gifs;
                    this._persist();
                    this._renderPanel();
                    BdApi.UI.showToast("Импорт готов!", { type: "success" });
                } catch { BdApi.UI.showToast("Ошибка файла!", { type: "error" }); }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // ───────────────────── Settings ─────────────────────
    getSettingsPanel() {
        const p = document.createElement("div");
        p.style.padding = "16px";
        p.innerHTML = '<div style="color:var(--header-primary);font-size:16px;font-weight:700;margin-bottom:12px;">GIF Organizer</div>' +
            '<div style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Категорий: <strong>' + this.categories.length + '</strong> | GIF: <strong>' + this.gifs.length + '</strong></div>' +
            '<button id="gif-org-reset-btn" style="background:#ED4245;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;">' + this._icon("warning") + ' Сбросить все</button>';
        p.querySelector("#gif-org-reset-btn").onclick = () => {
            if (confirm("Все данные будут удалены!")) {
                this.categories = []; this.gifs = []; this._persist();
                BdApi.UI.showToast("Данные сброшены.", { type: "info" });
            }
        };
        return p;
    }

    // ───────────────────── Helpers ─────────────────────
    _el(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    }

    _esc(str) {
        const d = document.createElement("div");
        d.textContent = str;
        return d.innerHTML;
    }
};
