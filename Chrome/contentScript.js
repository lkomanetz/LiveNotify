var cookieName = "livestream_message";
var intervalTime = 1000; // 1 second
var userHandle = "Logan";
var highlightColor = "#ff5c33";
var shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
var highlightedMessages = [];

var intervalHandle = setInterval(function() {
    var messages = getChatMessages();
    highlightShoulderTaps(messages);
}, intervalTime);

function getChatMessages() {
    return document.getElementById("chat_messages").childNodes;
}

function highlightShoulderTaps(messages) {
    for (var i = 0; i < messages.length; i++) {
        var messageContent = messages[i].getElementsByClassName("content")[0];
        var matches = messageContent.innerHTML.match(shoulderTapRegex);
        
        if (matches == null ||
            matches == "undefined" ||
            matches.length == 0) {
            
            continue;
        }
        
        if (hasMessageBeenHighlighted(messages[i])) {
            continue;
        }
        
        var newHtml = messages[i].innerHTML.replace(shoulderTapRegex, createSpanElement);
        messages[i].innerHTML = newHtml;
        
        highlightedMessages.unshift({
            sentBy: messages[i].getElementsByClassName("user_link")[0].title,
            sentOn: new Date(messages[i].getElementsByClassName("timeago")[0].title)
        });
        
        sendNotification(highlightedMessages[0]);
    }
}

function createSpanElement(match) {
    var elem = match;
    
    // TODO(Logan): Remove hard coded handle in favor of a data driven value.
    if (match.indexOf(userHandle) !== -1) {
        elem = "<span style='color:#000000;background-color:#b80000;font-weight:800;border-radius:2px'>" + match + "</span>";
    }
    
    return elem;
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

function sendNotification(message) {
    /*
    chrome.notifications.create("livenotify.notification", {
        title: "LiveNotify",
        type: "basic",
        priority: 2,
        message: message.sentBy + " has tapped you."
    }, function() {});
    */
}