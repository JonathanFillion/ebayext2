
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
	var sku_area = document.getElementById("editpaneSect_CustomLabel");
	var container = document.createElement("div")
	var table_menu = document.createElement("table");
	table_menu.style="border: 1px solid;"
	container.appendChild(table_menu)
	var tr = document.createElement("tr");
	tr.innerHTML = "<th>Element</th><th>Settings</th>";
	table_menu.appendChild(tr);

	for(let i = 0 ; i < skuStructure.length; i++){
		switch (skuStructure[i]) {
			case "ID":
			//if edited in popup, will it change in gensku button action ?
			break;

			case "SELECT":
			var tr = document.createElement("tr")
			var td1 = document.createElement("td")
			var td2 = document.createElement("td")

			var div1 = document.createElement("div")
			var input = document.createElement("input")
			input.disabled = true;
			input.value = skuStructure[i]["name"]
			div1.appendChild(input)
			td1.appendChild(div1)
			tr.appendChild(td1)
			
			var div2 = document.createElement("div")
			var select = document.createElement("select")
			var choices = skuStructure[i]["choices"].split(",");

			for(let j = 0; j < choices.length; j++) {
				var opt = document.createElement("option")
				opt.innerText = choices[i];
				select.appendChild(opt)
			}
			div2.appendChild(select)
			td2.appendChild(div2)
			tr.appendChild(td1)
			tr.appendChild(td2)
			table_menu.appendChild(tr)
			break;

			case "DATE":
			//If I change separator, will it be reflected in gensku action
			break;

			case "VALUE":
			var tr = document.createElement("tr")
			var td1 = document.createElement("td")
			var td2 = document.createElement("td")

			var div1 = document.createElement("div")
			var input = document.createElement("input")
			input.disabled = true;
			input.value = skuStructure[i]["name"]
			div1.appendChild(input)
			td1.appendChild(div1)
			tr.appendChild(td1)

			var div2 = document.createElement("div")
			var input = document.createElement("input")
			input.value = skuStructure[i]["currentValue"]
			div2.appendChild(input)
			td2.appendChild(div2)
			tr.appendChild(td2)
			table_menu.appendChild(tr)
			break;

			case "CONST":

			break;
		}

	}

	sku_area.appendChild(container);
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
