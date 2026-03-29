// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['masterEnabled'], (result) => {
    if (result.masterEnabled !== false) {
      chrome.storage.local.set({ masterEnabled: true });
      enableBlocking();
    } else {
      disableBlocking();
    }
  });
});

// Listen for messages from the popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_RULES') {
    if (message.enabled) {
      enableBlocking();
    } else {
      disableBlocking();
    }
  }
});

function enableBlocking() {
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["adult_blocklist"]
  });
  console.log("Domain blocking enabled");
}

function disableBlocking() {
  chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: ["adult_blocklist"]
  });
  console.log("Domain blocking disabled");
}
