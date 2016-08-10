var intervalTime = 1000; // 1 second
var cleanupIntervalTime = 1000; // 1 second
var maxTimeoutThresholdInHours = 1; 
var userHandle = "Logan";
var highlightColor = "#ff5c33";
var shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
var highlightedMessages = [];
var usersChatting = [];

//TODO(Logan): I only want to retrive the messages that haven't been processed yet.
var intervalHandle = setInterval(function() {
    var messages = getChatMessages();
    highlightShoulderTaps(messages);
}, intervalTime);

var cleanupIntervalHandle = setInterval(function() {
    cleanupActiveUsers();
}, cleanupIntervalTime);

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
        
        var msg = new Message();
        msg.sentBy = messages[i].getElementsByClassName("user_link")[0].title;
        msg.sentOn = new Date(messages[i].getElementsByClassName("timeago")[0].title);
        
        highlightedMessages.unshift(msg);
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

function buildUserChattingArray(messages) {
    for (var i = 0; i < messages.length; i++) {
        var user = new User();
        user.name = messages[i].getElementsByClassName("user_link")[0].title;
        user.lastMessageSentOn = new Date(messages[i].getElementsByClassName("timeago")[0].title);
        
        if (!doesUserExist(user)) {
            usersChatting.push(user);
        }
    }
}

function cleanupActiveUsers() {
    for (var i = 0; i < usersChatting.length; i++) {
        if (!isUserActive(usersChatting[i])) {
            usersChatting.splice(i, 1);
        }
    }
}

function doesUserExist(user) {
    var foundItems = usersChatting.filter(function(item) {
        return item.name === user.name;
    });
    
    if (foundItems.length === 1) {
        return true;
    }
    else {
        return false;        
    }
}

function isUserActive(user) {
    var now = new Date();
    var utcNow = new Date(now.toUTCString());
    var differenceInMilliseconds = Math.abs(utcNow - user.lastMessageSentOn);
    var differenceInHours = (differenceInMilliseconds / (60 * 60 * 1000));
    
    var isActive = (differenceInHours < maxTimeoutThresholdInHours) ? true : false;
    return isActive;
}

function User() {
    this.name;
    this.lastMessageSentOn;
}

function Message() {
    this.sentBy;
    this.sentOn;
}