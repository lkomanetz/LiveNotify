(function() {
    var btnApply = null;
    var lblCurrentHandle = null;
    var txtHandle = null;

    document.addEventListener("DOMContentLoaded", defineHandle_WindowLoaded);

    function defineHandle_WindowLoaded() {
        btnApply = document.getElementById("btnApply");
        lblCurrentHandle = document.getElementById("lblCurrentHandle");
        txtHandle = document.getElementById("txtHandle");

        btnApply.addEventListener("click", btnApply_Clicked);
        txtHandle.addEventListener("input", txtHandle_TextChanged);

        chrome.storage.sync.get("liveNotifyHandle", function (storageItem) {
            if (storageItem.liveNotifyHandle !== undefined) {
                lblCurrentHandle.innerText = "@" + storageItem.liveNotifyHandle;
            }
            else {
                lblCurrentHandle.innerText = storageItem.liveNotifyHandle;
            }
        });
    }

    function btnApply_Clicked() {
        lblCurrentHandle.innerText = "@" + txtHandle.value;
        saveHandle();
    }

    function txtHandle_TextChanged(evt) {
        var currentText = evt.currentTarget.value.replace(/[^\w]+/g, "");
        if (currentText !== "") {
            btnApply.disabled = false;
        }
        else {
            btnApply.disabled = true;
        }
        evt.currentTarget.value = currentText;
    }

    function saveHandle() {
        var currentHandle = lblCurrentHandle.innerText.replace("@", "");
        chrome.storage.sync.set({"liveNotifyHandle": currentHandle}, function () {});
    }
})();
