// Test script for Option 1 enhancements
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Simulate a page with a search query and high density of bad words
// url: https://google.com/search?q=funny+videos
const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <p>Word 1: porn</p>
  <p>Word 2: sex</p>
  <p>Word 3: nude</p>
  <p>Word 4: nsfw</p>
  <p>Word 5: porn</p>
  <p>Word 6: sex</p>
</body></html>`, { url: "https://example.com/?q=funny" });

const window = dom.window;
const document = window.document;
const Node = window.Node;

const BAD_WORDS = ['porn', 'sex', 'xxx', 'nude', 'nsfw'];
const DENSITY_THRESHOLD = 5;

let badWordCount = 0;
let pageBlocked = false;

function blockEntirePage(reason) {
  document.documentElement.innerHTML = `<body><h1>Blocked: ${reason}</h1></body>`;
}

function checkUrl() {
  let searchParams = new URLSearchParams(window.location.search);
  const queryParams = ['q', 'p', 'query', 'k', 'keyword', 'search'];
  for (const word of BAD_WORDS) {
    for (const param of queryParams) {
      const query = searchParams.get(param);
      if (query) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(query)) {
           return true; 
        }
      }
    }
  }
  return false;
}

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
      if (badWordCount >= DENSITY_THRESHOLD) {
        pageBlocked = true;
        blockEntirePage("High density");
      } else {
        node.textContent = content;
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      Array.from(node.childNodes).forEach(filterText);
    }
  }
}

if (checkUrl()) {
  pageBlocked = true;
  blockEntirePage("Search query blocked");
} else {
  filterText(document.body);
}

console.log(document.documentElement.innerHTML);
