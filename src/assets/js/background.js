
var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
var TRIAL_PERIOD_DAYS = 30;

chrome.identity.getAuthToken({interactive: true}, function(token) {

	var req = new XMLHttpRequest();

	req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
	req.setRequestHeader('Authorization', 'Bearer ' + token);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			var license = JSON.parse(req.responseText);
			console.log(license);
		}
	}
	req.send();

});


function init() {
	getLicense();
}

/*****************************************************************************
* Call to license server to request the license
*****************************************************************************/

function getLicense() {
	console.log(chrome.runtime.id)
	xhrWithAuth('GET', CWS_LICENSE_API_URL + chrome.runtime.id, true, onLicenseFetched);
}

function onLicenseFetched(error, status, response) {
	console.log(error, status, response);
	response = JSON.parse(response);
	if (status === 200) {
		parseLicense(response);
	} else {
	}
}

/*****************************************************************************
* Parse the license and determine if the user should get a free trial
*  - if license.accessLevel == "FULL", they've paid for the app
*  - if license.accessLevel == "FREE_TRIAL" they haven't paid
*    - If they've used the app for less than TRIAL_PERIOD_DAYS days, free trial
*    - Otherwise, the free trial has expired 
*****************************************************************************/

function parseLicense(license) {
	if (license.result && license.accessLevel == "FULL") {
		console.log("Fully paid & properly licensed.");
		access = {access:true, trial:false};
	} else if (license.result && license.accessLevel == "FREE_TRIAL") {
		var daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
		daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
		if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {
			console.log("Free trial, still within trial period");
			access = {access:true, trial:true, timeleft:(TRIAL_PERIOD_DAYS - daysAgoLicenseIssued)};
		} else {
			console.log("Free trial, trial period expired.");
			access = {access:false};			
		}
	} else {
		console.log("No license ever issued.");
	}
}

/*****************************************************************************
* Helper method for making authenticated requests
*****************************************************************************/

// Helper Util for making authenticated XHRs
function xhrWithAuth(method, url, interactive, callback) {
	var retry = true;
	getToken();

	function getToken() {
		console.log("Calling chrome.identity.getAuthToken", interactive);
		chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
			if (chrome.runtime.lastError) {
				callback(chrome.runtime.lastError);
				return;
			}
			console.log("chrome.identity.getAuthToken returned a token", token);
			access_token = token;
			requestStart();
		});
	}

	function requestStart() {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
		xhr.onload = requestComplete;
		xhr.send();
	}

	function requestComplete() {
		if (this.status == 401 && retry) {
			retry = false;
			chrome.identity.removeCachedAuthToken({ token: access_token },
				getToken);
		} else {
			callback(null, this.status, this.response);
		}
	}
}


init();

var access = false;


//For Inject.js in order to get tab, url, title.
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request)
		if(request.type === "identity"){
			sendResponse(sender);
		}
		else if (request.type === "access"){
			sendResponse(access)
		}

	});