/** @type {Map<number, string>} */
const tabIdToPrevUrl = new Map();

/**
 * Fired when a tab is updated.
 * @param {number} tabId
 * @param {Object} changeInfo
 * @param {string} [changeInfo.url] - The tab's URL if it has changed.
 */
function handleUpdated(tabId, { url }) {
  if (!URL.canParse(url)) return;

  const { hostname, pathname } = new URL(url);
  const prevUrl = tabIdToPrevUrl.get(tabId);

  const shouldClose =
    prevUrl &&
    new URL(prevUrl).hostname.endsWith(".awsapps.com") &&
    hostname === "127.0.0.1" &&
    pathname.startsWith("/oauth/callback");

  if (shouldClose) chrome.tabs.remove(tabId);

  tabIdToPrevUrl.set(tabId, url);
}

/**
 * Fired when a tab is closed.
 * @param {number} tabId
 */
function deleteTab(tabId) {
  tabIdToPrevUrl.delete(tabId);
}

chrome.tabs.onUpdated.addListener(handleUpdated);
chrome.tabs.onRemoved.addListener(deleteTab);
