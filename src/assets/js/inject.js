 function genSku(callback) {
 	chrome.storage.local.get(['savedid'], function(result) {
 		if(!result.savedid) {
 			result.savedid = 160;
 			console.log("init savedid to zero")
 		}
 		let id = result.savedid;
 		let nextid = id + 1;
 		let today = new Date();let d = String(today.getDate()).padStart(2, '0');let m = String(today.getMonth() + 1).padStart(2, '0');let y = today.getFullYear();
 		let currentDate = d+'.'+m+'.'+y;
 		let currentEmployee = 1;
 		let locationColumn = "a";
 		let locationRow = "2";
 		let location = locationColumn + "" + locationRow
 		let finalsku = id + "-" + location
 		chrome.storage.local.set({savedid: nextid})
 		callback(finalsku);
 	});
 }

 function genSku2(callback){
 	let listingSku = document.getElementById("editpane_skuNumber");
 	var sku_area = document.getElementById("editpaneSect_CustomLabel");
 	var div = document.createElement("div")
 	var currentSku = "";
 	var delim = "-";
 	for(var i = 0; i < skuStructure.length; i++) {

 		switch(skuStructure[i].type) {
 			case "select":
 			currentSku = currentSku + delim + skuStructure[i].choices[skuStructure[i].value]
 			break;
 			
 			case "value":
 			currentSku = currentSku + delim + skuStructure[i].value
 			break;

 			case "date":
 			let today = new Date();let d = String(today.getDate()).padStart(2, '0');let m = String(today.getMonth() + 1).padStart(2, '0');let y = today.getFullYear();
 			let currentDate = d+'.'+m+'.'+y;
 			currentSku = currentSku + delim + currentDate
 			break;
 			
 			case "id":
 			console.log(skuStructure[i].value)
 			if(skuStructure[i].value === "undefined" || parseInt(skuStructure[i].value, 10) < parseInt(skuStructure[i].startPoint,10)){
 				skuStructure[i].value = skuStructure[i].startPoint
 			} else {
 				skuStructure[i].value = parseInt(skuStructure[i].value, 10) + 1;
 			}
 			currentSku = currentSku + delim + skuStructure[i].value;
 			chrome.storage.local.set({saved_sku_structure: skuStructure})
 			break;

 		}

 	}
 	currentSku = currentSku.substr(1)
 	listingSku.value = currentSku
 }


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

 function addSkuButton() {
 	var sku_area = document.getElementById("editpaneSect_CustomLabel");
 	var gen_sku_button = document.createElement("button");
 	gen_sku_button.style = "background-color: orange;"
 	gen_sku_button.setAttribute("type", "button")  
 	gen_sku_button.innerText = "GENSKU"
 	sku_area.appendChild(gen_sku_button)
 	gen_sku_button.onclick = function() {
 		let listingSku = document.getElementById("editpane_skuNumber");
 		genSku(function(val){
 			listingSku.value = val
 		})
 	}
 }

 function genSkuControlMenu() {
 	addSkuButton()
 	var sku_area = document.getElementById("editpaneSect_CustomLabel");
 	var table = document.createElement("table")
 	for(var i = 0; i < skuStructure.length; i++){
 		var tr = document.createElement("tr")
 		var td1 = document.createElement("td")
 		var td2 = document.createElement("td")

 		console.log(skuStructure[i])
 		tr.id = "skugen-"+i
 		
 		switch(skuStructure[i].type) {
 			case "select":
 			var fieldTitle = document.createElement("span")
 			fieldTitle.innerText = skuStructure[i].name
 			td1.appendChild(fieldTitle)
 			var select = document.createElement("select")
 			for(var j = 0; j < skuStructure[i].choices.length; j++){

 				var option = document.createElement("option")
 				option.innerText = skuStructure[i].choices[j]
 				select.appendChild(option)

 			}
 			select.selectedIndex = skuStructure[i].value
 			select.addEventListener('change', function(){
 				var tr = this.parentElement.parentElement
 				skuStructure[tr.id.replace("skugen-", "")].value = this.selectedIndex
 				chrome.storage.local.set({saved_sku_structure: skuStructure})
 				console.log(skuStructure)
 			})
 			td2.appendChild(select)
 			tr.appendChild(td1)
 			tr.appendChild(td2)
 			table.appendChild(tr)
 			break;
 			
 			case "value":
 			var fieldTitle = document.createElement("span")
 			fieldTitle.innerText = skuStructure[i].name
 			td1.appendChild(fieldTitle)

 			var input = document.createElement("input")
 			input.addEventListener('change', function() {
 				var tr = this.parentElement.parentElement
 				skuStructure[tr.id.replace("skugen-", "")].value = this.value
 				chrome.storage.local.set({saved_sku_structure: skuStructure})
 			})
 			input.value = skuStructure[i].value
 			td2.appendChild(input)
 			tr.appendChild(td1)
 			tr.appendChild(td2)
 			table.appendChild(tr)
 			break;

 		}
 		sku_area.appendChild(table)
 	}
 	var save = document.createElement("button")
 	save.innerText = "Save"
 	save.type = "button"
 	sku_area.appendChild(save)
 	
 }


 function main(me, prefill_listing_active, prefills) {

 	set_sku = true;
 	//find sku structure
 	chrome.storage.local.get(['saved_sku_structure'], function(result) {
 		if(typeof result.saved_sku_structure !== "undefined") {
 			skuStructure = result.saved_sku_structure
 			console.log(skuStructure)
 		}

 		/*Repetitive listing parameters*/
 		/*Shippo address extractor*/
 		if(me.url.includes("app.goshippo.com/orders/")) {

 			var name = document.getElementById("r_name").innerText
 			var company = document.getElementById("r_company").innerText
 			var address1 = document.getElementById("r_street1").innerText
 			var address2 = document.getElementById("r_street2").innerText
 			var city = document.getElementById("r_city").innerText
 			var country = document.getElementById("r_country").innerText
 			var telephone = document.getElementById("r_phone").innerText


 			var div = document.createElement("div");
 			div.innerText = name + " " + company + "\n" + address1 + " " + address2 + "\n" + city + "\n" +country + "\n" + telephone;
 			div.style = "color: black;"
 			var json = document.createElement("div");
 			var data = {name: name, company: company, address1: address1, address2: address2, city: city, country: country, telephone:telephone}
 			json.innerText = JSON.stringify(data)

 			var recipient = document.getElementsByClassName("panel panel-default")[1]

 			recipient.appendChild(div)
 			recipient.appendChild(json)
 		}

 		/*Ebay Bulk Listing Prefiller*/
 		else if (me.url.includes("bulksell.ebay.") && me.tab.title.includes("Create your listing") && me.url.localeCompare("https://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem") !== 0) {
 			removePayingOptions()
 			genSkuControlMenu()
			if(set_sku) {
				let listingSku = document.getElementById("editpane_skuNumber");
				genSku(function(val){
					listingSku.value = val
				})
			}

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
			
			if(set_sku) {
				let listingSku = document.getElementById("editpane_skuNumber");
				genSku(function(val){
					listingSku.value = val
				})
			}
		}

	})
 }

 skuStructure = []

 chrome.extension.sendMessage({}, function(me) {

 	var readyStateCheckInterval = setInterval(function() {

 		if (document.readyState === "complete") {
 			clearInterval(readyStateCheckInterval);
 			main()
 		}
 	}, 2500);
 });
