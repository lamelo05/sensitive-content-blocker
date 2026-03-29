// A small list of example sensitive keywords for demonstration purposes
const BAD_WORDS = ['porn', 'sex', 'xxx', 'nude', 'nsfw'];
const DENSITY_THRESHOLD = 5;

const BIBLE_VERSES = [
  "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body. (1 Corinthians 6:18)",
  "But I say to you that everyone who looks at a woman with lustful intent has already committed adultery with her in his heart. (Matthew 5:28)",
  "For this is the will of God, your sanctification: that you abstain from sexual immorality; that each one of you know how to control his own body in holiness and honor. (1 Thessalonians 4:3-4)",
  "Put to death therefore what is earthly in you: sexual immorality, impurity, passion, evil desire, and covetousness, which is idolatry. (Colossians 3:5)",
  "How can a young man keep his way pure? By guarding it according to your word. (Psalm 119:9)",
  "Let marriage be held in honor among all, and let the marriage bed be undefiled, for God will judge the sexually immoral and adulterous. (Hebrews 13:4)",
  "I have made a covenant with my eyes; how then could I gaze at a virgin? (Job 31:1)",
  "Create in me a clean heart, O God, and renew a right spirit within me. (Psalm 51:10)",
  "Therefore submit to God. Resist the devil and he will flee from you. (James 4:7)",
  "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it. (1 Corinthians 10:13)"
];

let badWordCount = 0;
let pageBlocked = false;

// Completely replace the page content with a block screen
function blockEntirePage(reason) {
  // Stop observing to prevent loops
  if (window.observer) {
    window.observer.disconnect();
  }

  const randomVerse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];

  // Replace DOM
  document.documentElement.innerHTML = `
    <head>
      <title>Blocked by Sensitive</title>
      <style>
        body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: black;
          color: #333;
          text-align: center;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        h1 {
          color: #034c36;
          font-size: 3rem;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 10px 0;
          line-height: 1.5;
        }
        .reason {
          font-size: 1rem;
          color: #ff4757;
          font-weight: bold;
          margin-bottom: 40px;
        }
        .verse-container {
          max-width: 650px;
          padding: 25px 35px;
          background-color: white;
          border-left: 5px solid #034c36;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border-radius: 8px;
        }
        .verse-text {
          font-size: 1.15rem;
          font-style: italic;
          color: #444;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <h1>🛡️ Blocked by Sensitive</h1>
      <p>This page has been blocked to protect you from sensitive content.</p>
      <p class="reason">Reason: ${reason}</p>
      <div class="verse-container">
        <p class="verse-text">"${randomVerse}"</p>
      </div>
    </body>
  `;
}

// Check search queries in the URL (Google, Bing, etc.)
function checkUrl() {
  let searchParams;
  try {
    searchParams = new URLSearchParams(window.location.search);
  } catch(e) {
    searchParams = new URLSearchParams('');
  }
  
  const queryParams = ['q', 'p', 'query', 'k', 'keyword', 'search'];
  
  for (const word of BAD_WORDS) {
    // We check common query parameters for explicit words
    for (const param of queryParams) {
      const query = searchParams.get(param);
      if (query) {
        // Regex to match whole word in search string
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(query)) {
           return true; 
        }
      }
    }
  }
  return false;
}

// Redact text nodes and keep track of density
function filterText(node) {
  if (pageBlocked) return;

  if (node.nodeType === Node.TEXT_NODE) {
    let content = node.textContent;
    let original = content;
    
    BAD_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        badWordCount += matches.length;
        content = content.replace(regex, '***');
      }
    });

    if (content !== original) {
      // If we crossed the threshold, block the page immediately
      if (badWordCount >= DENSITY_THRESHOLD) {
        pageBlocked = true;
        blockEntirePage("High density of sensitive content detected on this page.");
      } else {
        // Otherwise just blur/censor the words found so far
        node.textContent = content;
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Avoid modifying scripts and styles
    if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'NOSCRIPT') {
      // Convert childNodes to array to safely iterate while we mutate text
      Array.from(node.childNodes).forEach(filterText);
    }
  }
}

function initFilter() {
  chrome.storage.local.get(['masterEnabled', 'keywordEnabled'], (result) => {
    const master = result.masterEnabled !== false;
    const keyword = result.keywordEnabled !== false;
    
    // Only run if both master toggle and keyword filtering are enabled
    if (master && keyword) {
      
      // 1. Immediately check search URL
      if (checkUrl()) {
        pageBlocked = true;
        blockEntirePage("Search query contains sensitive keywords.");
        return; // Stop execution
      }

      // 2. Initial DOM scan
      filterText(document.body);

      // 3. Setup MutationObserver to filter dynamically added content
      if (!pageBlocked) {
        window.observer = new MutationObserver((mutations) => {
          if (pageBlocked) return;
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (pageBlocked) return;
              if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                filterText(node);
              }
            });
          });
        });
        window.observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  });
}

// Ensure body is available before filtering
if (document.body) {
  initFilter();
} else {
  document.addEventListener('DOMContentLoaded', initFilter);
}
