var MessageProcessor = function() {
    this.shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
    this.lastProcessedMessage = null;
    this.messageContentClassName = "commenter_content ng-binding";
    this.commenterNameClassName = "commenter_name ng-binding";
    
    this.findIndexOf = function(msg, nodes) {
        if (msg == null) {
            return -1;
        }
        
        for (var i = 0; i < nodes.length; i++) {
            var sentBy = nodes[i].getElementsByClassName(this.commenterNameClassName)[0].innerText;
            var content = nodes[i].getElementsByClassName(this.messageContentClassName)[0].innerText;
            
            if (msg.sentBy === sentBy &&
               msg.content === content) {
                
                return i;
            }
        }
        
        console.log("Couldn't find message " + msg);
        return -1;
    };
}

MessageProcessor.prototype.process = function(messages) {
    var index = this.findIndexOf(this.lastProcessedMessage, messages);
    console.log("Index: " + index);
    if (index === -1) {
        index = 0;
    }
    
    /*
     * I'm wanting to process the messages in reverse order.  This means messages get processed
     * from bottom to top instead of top to bottom because of the way LiveStream's chat is setup.
     */
    for (var i = index + 1; i < messages.length; i++) {
        if (this.hasShoulderTaps(messages[i])) {
            this.highlightShoulderTaps(messages[i]);
        }
        
        this.lastProcessedMessage = {
            sentBy: messages[i].getElementsByClassName(this.commenterNameClassName)[0].innerText,
            content: messages[i].getElementsByClassName(this.messageContentClassName)[0].innerText
        };
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