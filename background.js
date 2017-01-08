chrome.browserAction.onClicked.addListener(function (tab) {
  var showingCatNames = localStorage['showingCatNames'];
  showingCatNames = showingCatNames && JSON.parse(showingCatNames);
  if (showingCatNames === undefined) {
    showingCatNames = true;
  }
  showingCatNames = !showingCatNames;
  localStorage['showingCatNames'] = JSON.stringify(showingCatNames);
  chrome.tabs.sendMessage(tab.id, {action: 'toggle', showingCatNames: showingCatNames });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "get-showingCatNames") {
      var showingCatNames = localStorage['showingCatNames'];
      showingCatNames = showingCatNames && JSON.parse(showingCatNames);
      if (showingCatNames === undefined) {
        showingCatNames = true;
      }
      sendResponse({showingCatNames: showingCatNames});
    }
});

chrome.storage.local.clear();
