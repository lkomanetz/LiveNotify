var btnApply = null;
var lblCurrentHandle = null;
var txtHandle = null;

document.addEventListener("DOMContentLoaded", defineHandle_WindowLoaded);

function defineHandle_WindowLoaded() {
    btnApply = document.getElementById("btnApply");
    lblCurrentHandle = document.getElementById("lblCurrentHandle");
    txtHandle = document.getElementById("txtHandle");
    
    btnApply.addEventListener("click", btnApply_Clicked);
    chrome.storage.sync.get("liveNotifyHandle", function (storageItem) {
        lblCurrentHandle.innerText = storageItem.liveNotifyHandle;
    });
}

function btnApply_Clicked() {
    chrome.storage.sync.set({"liveNotifyHandle": txtHandle.value}, function () {
        lblCurrentHandle.innerText = txtHandle.value;
    });
}

