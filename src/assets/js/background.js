//For Inject.js in order to get tab, url, title.
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.type === "identity"){
			sendResponse(sender);
		}
	});