/*
 * Registers the page action only for a tab that has "livestream" in the URL
 */
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "livestream" }
                })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
        }]);
    });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.get("liveNotifyHandle", function(storageItem) {
        var handle = storageItem.liveNotifyHandle.toLowerCase();
        chrome.storage.sync.set({"liveNotifyHandle": handle}, undefined);
    });
});