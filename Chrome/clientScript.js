var cookieName = "livestream_message";
var intervalTime = 5000; // 2 seconds
var userHandle = "Logan";
var highlightColor = "#ff5c33";
var shoulderTapRegex = /@[A-Za-z0-9]+/g;

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
        var matches = shoulderTapRegex.exec(messageContent.innerHTML);
        
        if (matches == null) {
            continue;
        }
        
        for (var j = 0; j < matches.length; j++) {
            if (matches[i].indexOf(userHandle) > -1) {
                var newSpan = createSpanElement(matches[j]);
                var newHtml = messages[i].innerHTML.replace(matches[j], newSpan);
                messages[i].innerHTML = newHtml;
            }
        }
    }
}

function createSpanElement(match) {
    var elem = "<span style='color:#000000;background-color: #b80000;font-weight: 800;border-radius: 2px'>" + match + "</span>";
    return elem;
}

/*
 * The following functions below may be used at a later time.  Right now
 * I'm just going to take an iterative approach and will first get something
 * simple working.
 */
function isUserTapped(shoulderTaps, username) {
    for (var i = 0; i < shoulderTaps.length; i++) {
        var parsedName = shoulderTaps[i].replace("@", "");
       
        if (parsedName.toLowerCase() === username.toLowerCase()) {
            return true;
        }
    } 
    
    return false;
}

function getLastProcessedMessage() {
    var cookies = document.cookie.split(";");
    var name = cookieName + "=";
    
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    
    return "";
}

function setLastProcessedMessage(message) {
    var now = new Date();
    now.setTime(now.getTime() + (1 * 24 * 60 * 60 * 1000)); // Sets the cookie to expire on the next day
    var expirationString = ";expires=" + now.toUTCString();
    
    var objectStr = JSON.stringify(message);
    document.cookie = cookieName + "=" + objectStr + expriationString;
    
    if (document.cookie) {
        return true;
    }
    else {
        return false;
    }
}