chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    whenLivestreamNotActive(function() {
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
    withLivestreamWindow(function(windowId, tabId) {
        openLivestream(windowId, tabId);
        clearNotification(notificationId);
    });
});

function whenLivestreamNotActive(sendNotificationAction) {
    chrome.windows.getAll({populate: true}, function(windows) {
        for (var i = 0; i < windows.length; i++) {
            for (var j = 0; j < windows[i].tabs.length; j++) {
                if (windows[i].tabs[j].url.indexOf("livestream") !== -1 &&
                    windows[i].state === "minimized" ||
                    windows[i].focused === false) {
                    
                    sendNotificationAction();
                }
            }
        }
    });
}

function openLivestream(windowId, tabId) {
    chrome.windows.update(windowId, {
        focused: true,
        state: "maximized"
    }, function(window) {
        chrome.tabs.update(tabId, {
            active: true
        });
    });
}

function clearNotification(notificationId) {
    chrome.notifications.clear(notificationId);
}

function withLivestreamWindow(callbackAction) {
    chrome.windows.getAll({populate: true}, function(windows) {
        var windowId = -1;
        var tabId = -1;
        for (var i = 0; i < windows.length; i++) {
            for (var j = 0; j < windows[i].tabs.length; j++) {
                if (windows[i].tabs[j].url.indexOf("livestream") !== -1) {
                    tabId = windows[i].tabs[j].id;
                    windowId = windows[i].id;
                    break;
                }
            }
            
            if (windowId !== -1) {
                callbackAction(windowId, tabId);
                break;
            }
        }
    });
}