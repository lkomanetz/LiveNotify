var notificationService = (function() {
    var BLACK_ICON_PATH = "icons/exclamation_mark_black.png";
    var ORANGE_ICON_PATH = "icons/exclamation_mark_orange.png";
    
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.shoulderTap == undefined) {
            return;
        }
        
        doWhenLivestreamNotActive(function() {
            var newId = createGuid();
            chrome.notifications.create(newId, {
                type: "basic",
                iconUrl: "icons/exclamation_point.ico",
                title: request.shoulderTap.sentBy + " just tapped you.",
                message: request.shoulderTap.content,
                buttons: [{
                    title: "View"
                }]
            });
        });
    });
    
    chrome.notifications.onButtonClicked.addListener(function(notificationId) {
        doWithLivestreamWindow(function(windowId, tabId) {
            openLivestream(windowId, tabId);
            clearNotificationFromScreen(notificationId);
        });
    });
    
    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

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

            if (isLivestreamFocused(livestreamWindow, livestreamTab)) {
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
    
    function isLivestreamFocused(livestreamWindow, livestreamTab) {
        return ((livestreamWindow.focused && !livestreamTab.active) ||
               !livestreamWindow.focused ||
               livestreamWindow.state === "minimized");
    }

    function clearNotificationFromScreen(notificationId) {
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
    
})();