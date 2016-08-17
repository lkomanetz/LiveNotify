var btnApply = null;
var lblCurrentHandle = null;
var txtHandle = null;
var shoulderTapsToAcknowledge = [];

document.addEventListener("DOMContentLoaded", defineHandle_WindowLoaded);

function defineHandle_WindowLoaded() {
    btnApply = document.getElementById("btnApply");
    lblCurrentHandle = document.getElementById("lblCurrentHandle");
    txtHandle = document.getElementById("txtHandle");
    
    btnApply.addEventListener("click", btnApply_Clicked);
    chrome.storage.sync.get("liveNotifyHandle", function (storageItem) {
        console.log(storageItem);
        lblCurrentHandle.innerText = storageItem.liveNotifyHandle;
    });
}

function btnApply_Clicked() {
    chrome.storage.sync.set({"liveNotifyHandle": txtHandle.value}, function () {
        lblCurrentHandle.innerText = txtHandle.value;
    });
}