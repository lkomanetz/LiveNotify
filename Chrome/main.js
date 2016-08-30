var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandles = [];
var intervalHandle = null;
var messageProcessor = null;
var commentClassName = "comment ng-scope";
var chatDoc = null;

window.onunload = function() {
    clearInterval(intervalHandle);
    lastProcessedMessage = null;
    messageProcessor = null;
}

// I'm waiting three seconds to make sure the dynamic HTML has loaded properly.
setTimeout(main, 3000);

function main() {
    var iframeDoc = document.getElementById("liveChatContainer");
    chatDoc = iframeDoc.contentDocument || iframeDoc.contentWindow.document;
    
    addCssToHead(chatDoc);
    getCurrentHandle();
    messageProcessor = new MessageProcessor();

    intervalHandle = setInterval(function() {
        var messages = getChatMessages();
        
        if (messages) {
            messageProcessor.process(messages);
        }
    }, intervalTime);
    listenForStorageChanges();
}

function getChatMessages() {
    var comments = chatDoc.getElementsByClassName("comment ng-scope");
    if (comments.length !== 0) {
        return comments;
    }
    else {
        return null;
    }
}

function getCurrentHandle() {
    chrome.storage.sync.get("liveNotifyHandles", function(storageItem) {
        userHandles = storageItem.liveNotifyHandles;
    });
}

function listenForStorageChanges() {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === "liveNotifyHandles") {
                userHandles = changes[key].newValue;
            }
        }
    });
}

function addCssToHead(iframeDoc) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.extension.getURL("css/liveNotify.css");
    
    iframeDoc.head.appendChild(link);
}