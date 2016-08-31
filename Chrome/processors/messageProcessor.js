var MessageProcessor = function() {
    this.shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
    this.lastProcessedMessage = null;
    this.lastProcessedMessageIndex = -1;
    this.messageContentClassName = "commenter_content ng-binding";
    this.commenterNameClassName = "commenter_name ng-binding";
}

MessageProcessor.prototype.process = function(messages) {
    var index = this.lastProcessedMessageIndex;
    if (index === -1) {
        index = 0;
    }
    
    /*
     * I want to start with the next message starting from the last processed message so I'm not
     * iterating through the entire message array each time.
     */
    for (var i = index + 1; i < messages.length; i++) {
        if (this.hasShoulderTaps(messages[i])) {
            this.highlightShoulderTaps(messages[i]);
        }
        
        this.lastProcessedMessageIndex = i;
    }
};

MessageProcessor.prototype.hasShoulderTaps = function(message) {
    var messageContent = message.getElementsByClassName(this.messageContentClassName)[0];
    var matches = messageContent.innerHTML.match(this.shoulderTapRegex);
    
    if (matches == null ||
       matches == "undefined" ||
       matches.length == 0) {
        
        return false;
    }
    else {
        return true;
    }
};

MessageProcessor.prototype.sendShoulderTappedEvent = function(message) {
    var shoulderTap = {
        sentBy: message.getElementsByClassName(this.commenterNameClassName)[0].innerText,
        content: this.trimMessageContent(message.getElementsByClassName(this.messageContentClassName)[0].innerText)
    };
    
    chrome.runtime.sendMessage({shoulderTap: shoulderTap}, undefined);
};

MessageProcessor.prototype.highlightShoulderTaps = function(message) {
    var messageContent = message.getElementsByClassName(this.messageContentClassName)[0];
    var processorContext = this;
    var userHandlesInMessage = [];
    
    var newHtml = message.innerHTML.replace(processorContext.shoulderTapRegex, function(match) {
        var elem = match;
        var matchWithoutSymbol = match.replace("@", "");
        
        for (var i = 0; i < userHandles.length; i++) {
            if (matchWithoutSymbol.toLowerCase() === userHandles[i].toLowerCase()) {
                elem = "<span class='label label-danger'>" + match + "</span>";
                userHandlesInMessage.push(matchWithoutSymbol);
            }
        }

        return elem;
    });
    message.innerHTML = newHtml;
    
    if (userHandlesInMessage.length > 0) {
        this.sendShoulderTappedEvent(message);
    }
};

MessageProcessor.prototype.trimMessageContent = function(messageContent) {
    var newContent = messageContent.replace(/[\r|\n].+/, "");
    
    // \u2013 and \u2014 searches for HTML ndash and mdash
    return newContent.replace(/^[A-Za-z0-9_\s\-\.]+\s*[\u2013|\u2014]\s*/, "");
};