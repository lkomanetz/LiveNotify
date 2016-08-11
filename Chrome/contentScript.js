var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandle = "Logan";
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
    processor = new MessageProcessor();
    
    intervalHandle = setInterval(function() {
        var messages = getChatMessages();
        processor.process(messages);
    }, intervalTime);
}

function getChatMessages() {
    return document.getElementById("chat_messages").childNodes;
}