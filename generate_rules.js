const fs = require('fs');

// Imagine you downloaded a massive list of 10,000 bad domains from the internet
// For this example, we just define a small array, but in reality, you would
// read this from a downloaded text file using fs.readFileSync()
const explicitDomains = [
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "redtube.com",
  "youporn.com",
  "tube8.com",
  "spankbang.com",
  "eporner.com",
  "beeg.com",
  "xhamster.com",
  "chaturbate.com",
  "livejasmin.com",
  "stripchat.com",
  "bongaCams.com",
  "onlyfans.com",
  "manyvids.com",
  "rule34.xxx",
  "gelbooru.com"
];

// We need to map our flat list of domains into the complex JSON objects
// that the Chrome declarativeNetRequest API requires.
const rules = explicitDomains.map((domain, index) => {
  return {
    "id": index + 1, // Rule IDs must be unique integers starting from 1
    "priority": 1,
    "action": {
      "type": "block"
    },
    "condition": {
      // urlFilter blocks any URL containing this string
      // adding || at the start means it exactly matches the domain (e.g. ||pornhub.com)
      "urlFilter": `||${domain}`, 
      // main_frame blocks the user from navigating to the site
      // sub_frame blocks embedded videos/iframes of the site
      "resourceTypes": ["main_frame", "sub_frame"]
    }
  };
});

// Write the formatted JSON to rules.json, ready for the extension to use!
fs.writeFileSync('rules.json', JSON.stringify(rules, null, 2));

console.log(`Successfully generated rules.json with ${rules.length} blocked domains!`);
