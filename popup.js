document.addEventListener('DOMContentLoaded', () => {
  const masterToggle = document.getElementById('masterToggle');
  const keywordToggle = document.getElementById('keywordToggle');

  // Load saved settings
  chrome.storage.local.get(['masterEnabled', 'keywordEnabled'], (result) => {
    masterToggle.checked = result.masterEnabled !== false; // Default true if undefined
    keywordToggle.checked = result.keywordEnabled !== false; // Default true if undefined
  });

  // Save settings on change
  masterToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ masterEnabled: isEnabled });
    // Tell background script to update rules
    chrome.runtime.sendMessage({ type: 'UPDATE_RULES', enabled: isEnabled });
  });

  keywordToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ keywordEnabled: e.target.checked });
  });
});
