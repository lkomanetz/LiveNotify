var s = document.createElement("script");
s.src = chrome.extension.getURL("clientScript.js");
(document.head || document.documentElement).appendChild(s);

s.onload = function() {
    s.parentNode.removeChild(this);
};