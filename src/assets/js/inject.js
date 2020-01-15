
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
	console.log("genSkuControlMenu")
	var tdStyles = "padding: 8px;border: 1px solid #dddddd;"
	var thStyles = "padding: 8px;border: 1px solid #dddddd;"


	var sku_area = document.getElementById("editpaneSect_CustomLabel");
	var container = document.createElement("div")
	var titleContainer = document.createElement("div")
	var title = document.createElement("span")
	title.innerText = "Sku Control Menu"
	title.style = "font-size: 10px"
	titleContainer.appendChild(title)
	container.appendChild(titleContainer)
	var table_menu = document.createElement("table");
	var tr = document.createElement("tr");
	var th1 = document.createElement("th")
	var th2 = document.createElement("th")
	th1.innerText = "Element Name"
	th2.innerText = "Settings"
	th1.style = thStyles
	th2.style = thStyles
	tr.appendChild(th1)
	tr.appendChild(th2)
	table_menu.appendChild(tr);
	console.log(skuStructure)
	for(let i = 0 ; i < skuStructure.length; i++){
		switch (skuStructure[i].TYPE) {
			case "ID":
			var tr = document.createElement("tr")
			var td1 = document.createElement("td")
			var td2 = document.createElement("td")
			td1.style = tdStyles
			td2.style = tdStyles
			var div1 = document.createElement("div")
			var input = document.createElement("input")
			input.disabled = true;
			input.value = skuStructure[i]["name"]
			div1.appendChild(input)
			td1.appendChild(div1)
			tr.appendChild(td1)

			var div2 = document.createElement("div")
			var input = document.createElement("input")
			input.value = skuStructure[i]["currentId"]
			input.onchange = function(){
				if(isNumeric(this.value)){
					skuStructure[i]["currentId"] = this.value
				} else {
					this.value = skuStructure[i]["currentId"]
				}
				saveSku()
			}
			
			div2.appendChild(input)
			td2.appendChild(div2)
			tr.appendChild(td2)
			table_menu.appendChild(tr)
			break;

			case "SELECT":
			console.log("SELECT")
			var tr = document.createElement("tr")
			var td1 = document.createElement("td")
			var td2 = document.createElement("td")
			td1.style = tdStyles
			td2.style = tdStyles
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
				opt.innerText = choices[j];
				select.appendChild(opt)
			}

			if(skuStructure[i]["currentValue"] != null){
				select.selectedIndex = parseInt(skuStructure[i]["currentValue"])
			} else {
				skuStructure[i]["currentValue"] = "0"
				select.selectedIndex = parseInt(skuStructure["currentValue"])

			}
			saveSku()
			select.onchange = function(){
				skuStructure[i]["currentValue"] = String(this.selectedIndex)
				saveSku()
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
				console.log("VALUE")
				var tr = document.createElement("tr")
				var td1 = document.createElement("td")
				var td2 = document.createElement("td")
				td1.style = tdStyles
				td2.style = tdStyles

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
				input.onchange = function(){
					skuStructure[i]["currentValue"] = this.value
					saveSku()
				}
				div2.appendChild(input)
				td2.appendChild(div2)
				tr.appendChild(td2)
				table_menu.appendChild(tr)
				break;

				case "CONST":

				break;
			}

		}

		table_menu.style="border: 1px solid;font-family: arial, sans-serif;width: 50%"
		container.style = "padding-top:8px;"
		container.appendChild(table_menu)

		var gensku = document.createElement("button")
		gensku.onclick = generateSku
		gensku.innerText = "Generate SKU"
		gensku.type = "button"
		var divbut = document.createElement("div")
		divbut.style = "padding-top:8px;"
		divbut.appendChild(gensku)
		container.appendChild(divbut)
		sku_area.appendChild(container);
	}

	function generateSku() {
		let listingSku = document.getElementById("editpane_skuNumber");
		let thesku = ""
		for(let i = 0 ; i < skuStructure.length; i++){
			switch (skuStructure[i].TYPE) {
				case "ID":
				skuStructure[i]["currentId"] = (parseInt(skuStructure[i]["currentId"]) + 1).toString()
				thesku = thesku + skuStructure[i]["currentId"]
				saveSku()
				break;

				case "SELECT":
				thesku = thesku + skuStructure[i]["choices"].split(",")[parseInt(skuStructure[i]["currentValue"])]
				break;

				case "DATE":
				let today = new Date();let d = String(today.getDate()).padStart(2, '0');let m = String(today.getMonth() + 1).padStart(2, '0');let y = today.getFullYear();
				let sep = skuStructure[i]["separator"]
				thesku = thesku + d + sep + m + sep + y;
				break;

				case "VALUE":
				thesku = thesku + skuStructure[i]["currentValue"]
				break;

				case "CONST":
				thesku = thesku + skuStructure[i]["currentValue"]
				break;
			}
		}

		listingSku.value = thesku;

	}

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}


	function saveSku() {
		console.log("in save")
		console.log(skuStructure)
		chrome.storage.local.set({sku: JSON.stringify(skuStructure)})
	}

	function main(me) {
		/*Ebay Bulk Listing Prefiller*/
		if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Create your listing") 
			&& me.url.localeCompare("https://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem") !== 0
	//&& me.url.localeCompare("https://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&&DraftURL=https://www.ebay.ca/sh/lst/drafts") !== 0
	) {
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
					skuStructure = JSON.parse(result.sku)
					main(me)
				}
			})
		}
	}, 2500);
});
