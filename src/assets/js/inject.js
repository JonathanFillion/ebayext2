
function removePayingOptions() {

	var boldfeecrap = document.getElementById("bold");
	var parentofbold = boldfeecrap.parentElement;
	parentofbold.remove();

	var subtitlecharges = document.getElementById("editpane_subtitle");
	var parentofsub = subtitlecharges.parentElement.parentElement;
	parentofsub.remove();

	var galleryPlus = document.getElementById("galleryPlus")
	var parentofgaleryplus = galleryPlus.parentElement
	parentofgaleryplus.remove();

	var photoDisplayTypeFee = document.getElementById("photoDisplayType")
	var parentofdisplaytype = photoDisplayTypeFee.parentElement
	parentofdisplaytype.remove();

}

function genSkuControlMenu(){

	for(let i = 0 ; i < skuStructure.length; i++){
		switch (skuStructure[i]) {
			case "ID":

			break;

			case "SELECT":

			break;

			case "DATE":

			break;

			case "VALUE":

			break;

			case "CONST":

			break;
		}

	}

}



function main(me) {

	/*Ebay Bulk Listing Prefiller*/
	if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Create your listing") && me.url.localeCompare("https://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem") !== 0) {
		removePayingOptions()
		genSkuControlMenu()
	}

	else if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Relist your listing") && !me.url.includes("/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem")) {
		removePayingOptions()
		genSkuControlMenu()
	}
	else if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Revise your listing") && !me.url.includes("/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem")) {
		removePayingOptions()
		genSkuControlMenu()
	} 
	else if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Sell similar")) {
		removePayingOptions()
		genSkuControlMenu()
	}
}

skuStructure = []

chrome.extension.sendMessage({}, function(me) {
	var readyStateCheckInterval = setInterval(function() {

		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			chrome.storage.local.get(['sku'], function(result) {
				if(result.sku){
					main(me)
				}
			})
		}
	}, 2500);
});
