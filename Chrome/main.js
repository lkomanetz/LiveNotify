var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandle = "";
var highlightedMessages = [];
var intervalHandle = null;
var messageProcessor = null;

window.onunload = function() {
    clearInterval(intervalHandle);
    lastProcessedMessage = null;
    messageProcessor = null;
    highlightedMessages = [];
}

setTimeout(main, 3000);

function main() {
    getCurrentHandle();
    processor = new MessageProcessor();
    
    intervalHandle = setInterval(function() {
        var messages = getChatMessages();
        processor.process(messages);
    }, intervalTime);
    listenForStorageChanges();
}

function getChatMessages() {
    return document.getElementById("chat_messages").childNodes;
}

function getCurrentHandle() {
    chrome.storage.sync.get("liveNotifyHandle", function(storageItem) {
        userHandle = storageItem.liveNotifyHandle;
    });
}

function listenForStorageChanges() {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === "liveNotifyHandle") {
                userHandle = changes[key].newValue;
            }
        }
    });
}