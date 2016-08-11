var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandle = "Logan";
var highlightColor = "#ff5c33";
var shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
var lastProcessedMessage = null;
var highlightedMessages = [];
var intervalHandle = null;

window.onunload = function() {
    clearInterval(intervalHandle);
    lastProcessedMessage = null;
    highlightedMessages = [];
}

setTimeout(main, 3000);

function main() {
    intervalHandle = setInterval(function() {
        var messages = getChatMessages();
        process(messages);
    }, intervalTime);
}

function getChatMessages() {
    return document.getElementById("chat_messages").childNodes;
}

function highlightShoulderTaps(message) {
    var messageContent = message.getElementsByClassName("content")[0];
    
    if (hasMessageBeenHighlighted(message)) {
        return;
    }
    
    var newHtml = message.innerHTML.replace(shoulderTapRegex, createSpanElement);
    message.innerHTML = newHtml;
    
    var msg = {
        sentBy: message.getElementsByClassName("user_link")[0].title,
        sentOn: new Date(message.getElementsByClassName("timeago")[0].title)
    };
    
    highlightedMessages.unshift(msg);
}

function hasShoulderTaps(message) {
    var messageContent = message.getElementsByClassName("content")[0];
    var matches = messageContent.innerHTML.match(shoulderTapRegex);
    
    if (matches == null ||
       matches == "undefined" ||
       matches.length == 0) {
        
        return false;
    }
    else {
        return true;
    }
}

function process(messages) {
    var index = findIndexOf(lastProcessedMessage, messages);
    if (index === -1) {
        index = messages.length;
    }
    
    for (var i = index - 1; i >= 0; i--) {
        if (hasShoulderTaps(messages[i])) {
            highlightShoulderTaps(messages[i]);
            sendShoulderTappedEvent(messages[i]);
        }
        
        lastProcessedMessage = {
            sentBy: messages[i].getElementsByClassName("user_link")[0].title,
            sentOn: new Date(messages[i].getElementsByClassName("timeago")[0].title)
        }
    }
}

function sendShoulderTappedEvent(message) {
    document.dispatchEvent(new CustomEvent("LiveNotify_ShoulderTapped", {
        detail: message
    }));
}

function createSpanElement(match) {
    var elem = match;
    
    // TODO(Logan): Remove hard coded handle in favor of a data driven value.
    if (match.indexOf(userHandle) !== -1) {
        elem = "<span style='color:#000000;background-color:#b80000;font-weight:800;border-radius:2px'>" + match + "</span>";
    }
    
    return elem;
}

function findIndexOf(msg, nodes) {
    if (msg == null) {
        return -1;
    }
    
    for (var i = 0; i < nodes.length; i++) {
        var sentBy = nodes[i].getElementsByClassName("user_link")[0].title;
        var sentOn = new Date(nodes[i].getElementsByClassName("timeago")[0].title);
        
        if (msg.sentBy === sentBy && msg.sentOn.getTime() === sentOn.getTime()) {
            return i;
        }
    }
    
    return -1;
}

function hasMessageBeenHighlighted(message) {
    if (highlightedMessages.length === 0) {
        return false;
    }
    
    var timestamp = new Date(message.getElementsByClassName("timeago")[0].title);
    var user = message.getElementsByClassName("user_link")[0].title;
    
    var foundMessages = highlightedMessages.filter(function(item) {
        return (item.sentOn.getTime() === timestamp.getTime()) && item.sentBy === user;
    });
    
    if (foundMessages.length === 0) {
        return false;
    }
    
    return true;
}