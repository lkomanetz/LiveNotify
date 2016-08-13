var MessageProcessor = function() {
    this.shoulderTapRegex = /@([A-Za-z0-9_]+)/g;
    this.lastProcessedMessage = null;
    
    this.findIndexOf = function(msg, nodes) {
        if (msg == null) {
            return -1;
        }
        
        for (var i = 0; i < nodes.length; i++) {
            var sentBy = nodes[i].getElementsByClassName("user_link")[0].title;
            var sentOn = new Date(nodes[i].getElementsByClassName("timeago")[0].title);
            
            if (msg.sentBy === sentBy &&
               msg.sentOn.getTime() === sentOn.getTime()) {
                
                return i;
            }
        }
        
        return -1;
    };
}

MessageProcessor.prototype.process = function(messages) {
    var index = this.findIndexOf(this.lastProcessedMessage, messages);
    if (index === -1) {
        index = messages.length;
    }
    
    /*
     * I'm wanting to process the messages in reverse order.  This means messages get processed
     * from bottom to top instead of top to bottom because of the way LiveStream's chat is setup.
     */
    for (var i = index - 1; i >= 0; i--) {
        if (this.hasShoulderTaps(messages[i])) {
            this.highlightShoulderTaps(messages[i]);
        }
        
        this.lastProcessedMessage = {
            sentBy: messages[i].getElementsByClassName("user_link")[0].title,
            sentOn: new Date(messages[i].getElementsByClassName("timeago")[0].title)
        };
    }
};

MessageProcessor.prototype.hasShoulderTaps = function(message) {
    var messageContent = message.getElementsByClassName("content")[0];
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
    var sentBy = message.getElementsByClassName("user_link")[0].title;
    var notificationMsg = sentBy + " just tapped you.\n";
    
    chrome.runtime.sendMessage({detail: notificationMsg}, function(response) {
        // console.log(response.detail);
    });
};

MessageProcessor.prototype.highlightShoulderTaps = function(message) {
    var messageContent = message.getElementsByClassName("content")[0];
    var processorContext = this;
    var newHtml = message.innerHTML.replace(this.shoulderTapRegex, function(match) {
        var elem = match;
        
        // TODO(Logan):  Remove hard coded handle in favor of a data driven value.
        if (match.indexOf(userHandle) !== -1) {
            elem = "<span style='color:#000000;background-color:#b80000;font-weight:800;border-radius:2px'>" + match + "</span>";
            processorContext.sendShoulderTappedEvent(message);
        }

        return elem;
    });
    message.innerHTML = newHtml;
    
    var msg = {
        sentBy: message.getElementsByClassName("user_link")[0].title,
        sentOn: new Date(message.getElementsByClassName("timeago")[0].title)
    };
    
    window.highlightedMessages.push(msg);
};