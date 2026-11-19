<div align="center">
  <img src="img/128.png" alt="Lex Logo" width="110" />
  <h1>Lex</h1>
  <p><strong>A simple and powerful browser extension for daily WordPress, Design, and Productivity tasks.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Manifest-V3-424aff?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Version-1.0.0-a9b5ff?style=for-the-badge" alt="Version 1.0.0" />
    <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5" />
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+" />
  </p>
</div>

---

## 📖 About the Project

**Lex** is a browser extension for Chromium-based browsers (Google Chrome, Brave, Microsoft Edge, Opera) designed to streamline the workflow of **WordPress developers, UI/UX designers, and web creators**.

Instead of juggling dozens of tabs and external tools to check color contrast, generate gradients, install recurring plugins, set up 301 redirects, or jot down quick notes, Lex centralizes everything into a modern dark-themed popup (*Dark UI*) and injects smart utilities directly into the WordPress dashboard (`wp-admin`).

---

## ✨ Detailed Features

### 🏠 1. Home Tab (Daily Inspiration)
A calm and inspiring starting point for your workday:
- **Random Bible Verse:** Automatically fetches passages from Proverbs, Psalms, and Ecclesiastes via `bible-api.com` (Almeida - ARA translation).
- **Favorites System:** Save and manage your favorite verses in a dedicated sidebar (`chrome.storage.local`).
- **Quick Actions:** Copy the formatted verse with a single click or open the full chapter directly on *Bíblia Online*.

---

### 🌐 2. WordPress Tab & `wp-admin` Automation
Smart tools that interact directly with the active tab to diagnose and automate WordPress tasks:

#### 🔍 Real-Time WordPress Detector
Automatically checks whether the website in the active tab runs on WordPress using 3 layers of DOM inspection:
1. **Generator Meta Tag:** Checks for the presence of `<meta name="generator" content="WordPress...">`.
2. **REST API Link:** Detects the `<link rel="https://api.w.org/">` header tag.
3. **Directory Structure:** Inspects scripts and stylesheets loaded from `/wp-content/` or `/wp-includes/`.
- *Also includes a one-click download button for the latest WordPress release (`latest.zip`).*

#### 🧩 Curated Plugin Catalog & Quick Installer
A handpicked list of **15 essential plugins** from the WordPress ecosystem, allowing you to **Preview** (highlights the plugin card in the dashboard search with an animation) or **Install** directly on the active site in 1 click:
- *Elementor Website Builder*
- *SEOPress – On-site SEO*
- *Rank Math SEO*
- *Classic Editor*
- *Redirection*
- *All-in-One WP Migration*
- *LiteSpeed Cache*
- *WPCode (Insert Headers and Footers)*
- *Duplicate Page*
- *Enable Media Replace*
- *Better Search Replace*
- *Wordfence Security*
- *Export media with selected content*
- *Safe SVG*
- *kk Star Ratings*

#### 🔀 Automatic 301 Redirect Creator
Direct integration with the **Redirection** plugin:
- Automatically detects if the site uses WordPress and whether the *Redirection* plugin is active.
- Automatically captures the domain and *slug* of the current page.
- Creates 301 redirects directly via an authenticated request (`x-wp-nonce`) to the WordPress REST API (`/wp-json/redirection/v1/redirect/`) without having to open manual settings.

#### 🏝️ Tool Island in the WordPress Dashboard (`wp-admin/edit.php`)
When viewing Posts, Pages, or Custom Post Types lists in the WordPress admin panel, Lex injects a **collapsible floating toolbar (Tool Island)** at the top of the screen with bulk actions:
- **Edit All:** Selects all items on the page, sets the bulk action dropdown to "Edit", and applies it automatically.
- **View All:** Opens the preview/view links of all listed pages or posts in new tabs simultaneously.
- **View Selected:** Opens in new tabs only the posts or pages you have checked.

---

### 🎨 3. Design Tab
Quick-access visual utilities for UI and CSS adjustments:

- **🎯 Color Picker:**
  - Interactive Hue, Saturation, and Value (HSV) selector.
  - Real-time bidirectional conversion between **HEX**, **RGB**, and **HSL**.
  - One-click copy-to-clipboard buttons with visual feedback.
- **👁️ Contrast Checker (WCAG 2.1):**
  - Exact calculation of relative luminance and contrast ratio (e.g., `4.50:1`, `7.00:1`).
  - Instant validation with pass/fail badges (**AA**, **AAA**, or **FAIL**) for both normal and large text.
  - Live preview box combining *Background* and *Foreground* colors.
- **🌈 CSS Gradient Generator:**
  - Visual builder for **Linear** (with angle control from `0°` to `360°`) and **Radial** gradients.
  - Automatic generation of copy-ready CSS properties (`linear-gradient(...)` / `radial-gradient(...)`).

---

### 🛠️ 4. Tools Tab
Technical utilities for front-end development and rapid page inspection:

- **📋 Form Masking & Validation:**
  - **Corporate Email Validation Generator:** Enter the input's `name` attribute (e.g., `email`) and copy a complete, minified `<script>` snippet that blocks free email providers (`@gmail.com`, `@hotmail.com`, `@yahoo.com`, `@outlook.com`, `@uol.com.br`, etc.) using the native HTML5 Constraint Validation API.
- **✒️ Design Mode (`document.designMode`):**
  - Toggle live free-form text editing on any webpage in real time.
  - Ideal for testing headlines, line breaks, and copywriting directly in the browser before modifying code or CMS content.

---

### 📝 5. Lex Note (Full-Featured Notepad)
Accessible from the top bar, **Lex Note** opens in a dedicated page (`notes.html`) for managing notes and drafts:
- **Rich Text Editor (Quill.js):** Full formatting support including headings (H1, H2, H3), bold, italic, underline, strikethrough, ordered/unordered lists, text/background colors, alignment, and links.
- **Built-in Security:** All HTML note content is sanitized with **DOMPurify** before saving.
- **Instant Search:** Filter your notes in real time by title or content.
- **🥚 Easter Egg (Asteroids):** Create a note with the exact title `asteroids` and leave the body blank to unlock a secret button that launches the classic **Asteroids** arcade game rendered in **p5.js** (`asteroids.html`)!

---

## ⌨️ Shortcuts & Smart Persistence

- **Global Shortcut:** Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>2</kbd> at any time to quickly open the Lex popup.
- **Navigation Memory:** The extension automatically remembers the last main tab and sidebar sub-tab you were using (`lastMainTab`, `lastWordpressTab`, `lastDesignTab`, `lastToolsTab`), restoring your exact state when reopened.

---

## 🗂️ Project Structure

```text
Lex/
├── css/
│   ├── asteroids.css          # Styles for the Asteroids mini-game
│   ├── bootstrap.min.css      # Bootstrap 5.3 framework
│   ├── contrast-checker.css   # WCAG checker badge and preview styles
│   ├── default.css            # Main dark theme, CSS variables, and animations
│   ├── export.css             # Styles injected into wp-admin (Tool Island & animations)
│   ├── note-block.css         # Styles for the Lex Note page
│   └── quill.snow.css         # Quill.js Snow editor theme
├── fonts/                     # Local fonts used across the project
├── img/
│   ├── svg/                   # Vector icons and illustrations (White Hole, Black Hole, etc.)
│   └── 16..512.png            # Extension icons in multiple resolutions
├── js/
│   ├── content-scripts/
│   │   ├── design-mode.js     # Injected script to toggle document.designMode
│   │   └── wp-admin.js        # Injected script for wp-admin/edit.php (Tool Island)
│   ├── librarys/              # Local libraries (Bootstrap, DOMPurify, p5.js, Quill.js)
│   ├── other/
│   │   └── asteroids.js       # Asteroids game logic in p5.js
│   ├── tools/
│   │   ├── bible.js           # Bible verse API integration
│   │   ├── color-picker.js    # HSV/RGB/HEX/HSL color conversion math
│   │   ├── contrast-checker.js# Contrast ratio and WCAG 2.1 compliance calculation
│   │   ├── gradient-generator.js # Dynamic CSS gradient generation
│   │   ├── note.js            # Note CRUD operations with Quill.js and LocalStorage
│   │   ├── redirection.js     # 301 redirect automation via WP REST API
│   │   └── validation-fields.js # Form validation snippet generator
│   ├── utils/
│   │   ├── chrome-api.js      # Wrappers for chrome.tabs, URLs, and messaging
│   │   ├── create-element.js  # DOM element creation helper
│   │   ├── dom.js             # Toast notification system, clipboard, and sanitization
│   │   ├── listeners.js       # Centralized event listeners and tab state memory
│   │   ├── objects.js         # WP plugin catalog, validation snippets, and messages
│   │   ├── storage.js         # State persistence in chrome.storage.local
│   │   ├── template.js        # Reusable HTML templates (loaders, etc.)
│   │   └── wordpress.js       # WordPress detection engine on the active DOM
│   ├── background.js          # Service Worker (keyboard shortcuts and tab handling)
│   ├── main.js                # Popup entry point (modular initialization)
│   └── popup.js               # Popup UI controllers
├── asteroids.html             # Asteroids Easter Egg page
├── index.html                 # Main extension popup interface
├── manifest.json              # Extension configuration (Manifest V3)
└── notes.html                 # Dedicated notepad interface (Lex Note)
```

---

## 🚀 How to Install (Developer Mode)

Since this extension is built on **Manifest V3**, you can install it locally on any Chromium-based browser by following these steps:

1. **Clone or download this repository:**
   ```bash
   git clone [https://github.com/your-username/Lex.git](https://github.com/your-username/Lex.git)
   ```
2. Open your browser and navigate to the extensions management page:
   - **Chrome:** `chrome://extensions/`
   - **Brave:** `brave://extensions/`
   - **Edge:** `edge://extensions/`
3. In the top-right corner, toggle on **Developer mode**.
4. Click the **Load unpacked** button.
5. Select the root `Lex` project folder (where `manifest.json` is located).
6. You're all set! Pin the **Lex** icon to your browser toolbar or press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>2</kbd> to start using it.

---

## 🛡️ Permissions Used

Lex only requests the permissions strictly required for its tools to operate in `manifest.json`:

| Permission | Purpose |
| :--- | :--- |
| `storage` | Save favorite Bible verses, *Design Mode* state, and last opened tab memory. |
| `activeTab` & `tabs` | Identify the active domain to detect WordPress, install plugins, and create redirects. |
| `scripting` | Execute WordPress detection scripts, plugin automation, and Redirection API nonce retrieval. |
| `clipboardWrite` | Copy colors, CSS snippets, Bible verses, and validation scripts with one click. |
| `host_permissions (<all_urls>)` | Allow *Design Mode*, the WordPress detector, and the *Tool Island* (`wp-admin`) to work on any domain you are developing on. |

---

## 🛠️ Technologies & Libraries

- **HTML5 & CSS3** (Custom CSS variables, Flexbox/Grid, Glassmorphism & Dark Theme)
- **JavaScript (ES6+ Modules)**
- **[Bootstrap 5.3](https://getbootstrap.com/)** — UI components, tabs, modals, and tooltips
- **[Quill.js](https://quilljs.com/)** — Rich text editor for *Lex Note*
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — XSS sanitization for saved notes
- **[p5.js](https://p5js.org/)** — Graphics engine for the *Asteroids* mini-game
- **[Iconify API](https://iconify.design/)** & **Google Fonts** (*Quicksand* and *Fleur De Leah*)