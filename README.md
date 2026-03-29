# 🛡️ Sensitive Content Blocker

A powerful, intelligent browser extension meticulously designed to protect users and their families from explicit material on the web. This extension creates a safe browsing environment using dynamic keyword density scanning and strict domain blocking, all managed through a premium glassmorphic interface.

## 🌟 Key Features

* **Intelligent Keyword Filtering:** Dynamically scans the text and URLs of webpages for mature and sensitive keywords. If the density of these words crosses a safe threshold, the page is immediately replaced with a protective overlay.
* **Network-Level Domain Blocking:** Uses modern `declarativeNetRequest` rules to instantly terminate connections to known adult domains *before* they even begin to load.
* **Words of Encouragement:** Whenever a page is blocked dynamically, the extension displays a randomized, encouraging Bible verse to help navigate away from temptation.
* **Premium Glassmorphic UI:** Control your settings through a beautiful, transparent, frosted-glass popup menu equipped with soothing lemon-gold accents.
* **Instant Toggle Controls:** Easily toggle the master blocker or individual keyword filtering engines straight from the browser bar.

## 🚀 Installation (Local Development)

To run this extension locally in Chrome or Edge:

1. Download or clone this repository to your local machine.
2. Open your browser and navigate to the extensions page:
   * Chrome: `chrome://extensions/`
   * Edge: `edge://extensions/`
3. Toggle on **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the `Sensitive` project folder.
6. The extension is now installed! You can pin it to your toolbar for easy access.

## 🛠️ How it Works

* **`content.js`**: The brains of the dynamic text filtering. It actively observes the DOM for changes, runs regex matching against an array of explicit keywords (`BAD_WORDS`), and triggers the `blockEntirePage` overlay if the limits are exceeded.
* **`rules.json`**: An unchangeable networking ruleset that immediately blocks requests to predetermined unsafe wildcard domains.
* **`popup.html` & `popup.css`**: The user interface files built natively with HTML/CSS, displaying a transparent responsive layout built off a frosted glass aesthetic (`backdrop-filter: blur()`).
* **`background.js`**: Reinstates rules and passes messages between the active tab and the settings configured in Chrome's local storage.

## 🤝 Contribution

Feel free to fork the repository, tweak the CSS, or securely enhance the internal blocklists. All respectful contributions to code safety and UI are welcome!
