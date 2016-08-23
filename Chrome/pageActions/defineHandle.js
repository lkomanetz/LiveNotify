(function() {
    var btnApply = null;
    var txtHandle = null;
    var lstHandles = null;
    var handles = [];

    document.addEventListener("DOMContentLoaded", defineHandle_WindowLoaded);
    
    function defineHandle_WindowLoaded() {
        btnApply = document.getElementById("btnApply");
        txtHandle = document.getElementById("txtHandle");
        lstHandles = document.getElementById("lstHandles");

        btnApply.addEventListener("click", btnApply_Clicked);
        txtHandle.addEventListener("input", txtHandle_TextChanged);

        chrome.storage.sync.get("liveNotifyHandles", function (storageItem) {
            for (var i = 0; i < storageItem.liveNotifyHandles.length; i++){
                addHandleToList(storageItem.liveNotifyHandles[i]);
            }
        });
    }

    function btnApply_Clicked() {
        addHandleToList(txtHandle.value);
    }

    function txtHandle_TextChanged(evt) {
        var nonAlphaNumericRegex = /[^\w]+/g;
        var currentText = evt.currentTarget.value.replace(nonAlphaNumericRegex, "");
        if (currentText !== "") {
            btnApply.disabled = false;
        }
        else {
            btnApply.disabled = true;
        }
        evt.currentTarget.value = currentText.toLowerCase();
    }

    function saveHandle() {
        chrome.storage.sync.set({"liveNotifyHandles": handles}, function () {
            txtHandle.value = "";
        });
    }
    
    function addHandleToList(handle) {
        var listItem = document.createElement("li");
        listItem.className += "list-group-item";
        listItem.setAttribute("id", "li_" + handle);
        
        var removeBtn = document.createElement("button");
        removeBtn.className += "btn btn-default btn-sm";
        removeBtn.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
        removeBtn.onclick = function() {
            removeHandleFromList(handle, listItem.getAttribute("id"));
        };
        
        var handleSpan = document.createElement("label");
        handleSpan.innerText = "@" + handle;
        
        listItem.appendChild(handleSpan);
        listItem.appendChild(removeBtn);
        
        lstHandles.appendChild(listItem);
        handles.push(handle);
        
        saveHandle();
    }
    
    function removeHandleFromList(handle, listItemId) {
        var itemToRemove = document.getElementById(listItemId);
        var parent = document.getElementById("lstHandles");
        
        parent.removeChild(itemToRemove);
        
        var index = handles.indexOf(handle);
        if (index > -1) {
            handles.splice(index, 1);
        }
        
        saveHandle();
    }
    
})();
