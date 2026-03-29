// Check Incognito Access (Option A: Startup & Install)
function checkIncognitoAccess() {
  chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
    if (!isAllowed) {
      // Nag the user by opening a new tab to our beautiful warning screen
      chrome.tabs.create({ url: chrome.runtime.getURL('nag.html') });
    }
  });
}

// Initialize extension state (runs on install/update)
chrome.runtime.onInstalled.addListener(() => {
  checkIncognitoAccess();
  
  chrome.storage.local.get(['masterEnabled'], (result) => {
    if (result.masterEnabled !== false) {
      chrome.storage.local.set({ masterEnabled: true });
      enableBlocking();
    } else {
      disableBlocking();
    }
  });
});

// Run every time the Chrome browser is started
chrome.runtime.onStartup.addListener(() => {
  checkIncognitoAccess();
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
