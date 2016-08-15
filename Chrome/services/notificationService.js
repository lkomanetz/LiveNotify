chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    doWhenLivestreamNotActive(function() {
        chrome.notifications.create("LiveNotify_ShoulderTap", {
            type: "basic",
            iconUrl: "icons/exclamation_point.ico",
            title: "LiveNotify",
            message: request.detail,
            isClickable: true
        });
    });
});

chrome.notifications.onClicked.addListener(function(notificationId) {
    doWithLivestreamWindow(function(windowId, tabId) {
        openLivestream(windowId, tabId);
        clearNotification(notificationId);
    });
});

function doWhenLivestreamNotActive(sendNotificationAction) {
    chrome.windows.getAll({populate: true}, function(windows) {
        var livestreamTab = null;
        var livestreamWindow = null;
        
        for (var i = 0; i < windows.length; i++) {
            for (var j = 0; j < windows[i].tabs.length; j++) {
                if (windows[i].tabs[j].url.indexOf("livestream") !== -1) {
                    livestreamTab = windows[i].tabs[j];
                    livestreamWindow = windows[i];
                }
            }
        }
        
        if (livestreamWindow == null) {
            return;
        }
        
        if (!livestreamTab.active || livestreamWindow.state === "minimized") {
            sendNotificationAction();
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

function doWithLivestreamWindow(callbackAction) {
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