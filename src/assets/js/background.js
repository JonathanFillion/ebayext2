
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Is this still being used ? bs")
    //don't remove this sendResponse()
    sendResponse(sender);
  });