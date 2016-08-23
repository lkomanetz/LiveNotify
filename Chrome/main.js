var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandles = "";
var highlightedMessages = [];
var intervalHandle = null;
var messageProcessor = null;

window.onunload = function() {
    clearInterval(intervalHandle);
    lastProcessedMessage = null;
    messageProcessor = null;
    highlightedMessages = [];
}

// I'm waiting three seconds to make sure the dynamic HTML has loaded properly.
setTimeout(main, 3000);

function main() {
    getCurrentHandle();
    processor = new MessageProcessor();

    intervalHandle = setInterval(function() {
        var messages = getChatMessages();
        
        if (messages) {
            processor.process(messages);
        }
    }, intervalTime);
    listenForStorageChanges();
}

function getChatMessages() {
    var messagesElement = document.getElementById("chat_messages");
    if (messagesElement !== null) {
        return document.getElementById("chat_messages").childNodes;
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