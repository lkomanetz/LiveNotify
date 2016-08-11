chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (!isLivestreamActive) {
        return;
    }
    
    whenLivestreamActive(function() {
        chrome.notifications.create("LiveNotify_ShoulderTap", {
            type: "basic",
            iconUrl: "exclamation_point.ico",
            title: "LiveNotify",
            message: request.detail,
            isClickable: true
        });
    });
});

chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.tabs.query({url: "*://livestream.com/*"}, function(tabs) {
        if (tabs[0] !== undefined) {
            openLivestream(tabs[0].id);
            clearNotification(notificationId);
        }
    });
});

function whenLivestreamActive(sendNotificationAction) {
    chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs) {
        var index = tabs[0].url.indexOf("livestream");
        isActive = index > -1;
        
        if (!isActive) {
            sendNotificationAction();
        }
    });
}

function openLivestream(tabId) {
    chrome.tabs.update(tabId, {selected: true});
}

function clearNotification(notificationId) {
    chrome.notifications.clear(notificationId);
}