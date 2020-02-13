
import { Component, ChangeDetectorRef } from '@angular/core';
import { SkuFieldsTypeList } from './models/SkuExternal/sku-fields-type-list';
import { SkuIdField } from './models/SkuInternals/sku-id-field';
import { SkuSelectionField } from './models/SkuInternals/sku-selection-field';
import { SkuDateField } from './models/SkuInternals/sku-date-field';
import { SkuValueField } from './models/SkuInternals/sku-value-field';
import { SkuValueConstantField } from './models/SkuInternals/sku-value-constant-field';
import { Prefills } from './models/prefills'; 
import { Options } from './models/options'; 


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	prefills: Prefills;
	options: Options
	currentSelectionType: string;
	currentNameOfNewField: string;
	smallErrorMessage: string = "";
	sfl: SkuFieldsTypeList;
	SKU: any[] = [];
	_skuStateWhenSaved: string;
	isSkuCustomizationActive = true;
	isPrefillingActive = false;
	errorList: string[] = []
	mockedSku: string = ""
	kaching:number = 3
	skuIsDisplayed = true;
	fillingsIsDisplayed = false;
	aBitHigher = false;
	optionsIsDisplayed = false;

	constructor(private changeDetectorRef: ChangeDetectorRef) {
		this.sfl = new SkuFieldsTypeList()
		this.prefills = new Prefills()
		this.options = new Options()
	}

	ngOnInit() {
		chrome.storage.local.get(['date'], (result) => {
			
			if(result.date === undefined){
				result.date = Date.now();
				chrome.storage.local.set({date: result.date})
			}
			let daysSinceBeginning = Date.now() - parseInt(result.date,10)
			daysSinceBeginning = daysSinceBeginning / 1000 / 60 / 60 / 24;

			/*if(daysSinceBeginning  > 30){
				this.aBitHigher = true;
				this.changeDetectorRef.detectChanges()
			}*/
		})

		chrome.storage.local.get(['sku', 'prefills', 'options'], (result) => {
			if(result.sku){
				this.createSkuModelFromJson(result.sku);
			}
			if(result.prefills){
				this.loadPrefillsFromJson(result.prefills)
			}
			if(result.options){
				this.loadOptionsFromJson(result.options)
			}
		})
	}
	savePrefills() {
		console.log(this.prefills)
		chrome.storage.local.set({prefills : JSON.stringify(this.prefills)})
	}

	saveOptions(){
		chrome.storage.local.set({options:JSON.stringify(this.options)})
	}
	displaySku(){
		this.skuIsDisplayed = true
		this.fillingsIsDisplayed = false
		this.optionsIsDisplayed = false;
	}

	displayFillings(){
		this.skuIsDisplayed = false
		this.fillingsIsDisplayed = true
		this.optionsIsDisplayed = false;
	}

	displayOptions() {
		this.skuIsDisplayed = false
		this.fillingsIsDisplayed = false
		this.optionsIsDisplayed = true;
	}

	loadPrefillsFromJson(prefillsJson:string){
		this.prefills = JSON.parse(prefillsJson)
		console.log(this.prefills)
		
	}

	loadOptionsFromJson(optionsJson:string){
		this.options = JSON.parse(optionsJson)
	}

	createSkuModelFromJson(skuJson: string) {
		let skuObject: any[] = JSON.parse(skuJson);

		for (let i = 0; i < skuObject.length; i++) {
			switch (skuObject[i]["TYPE"]) {
				case "ID":
				this.SKU.push(new SkuIdField(skuObject[i]["name"], skuObject[i]["currentId"]))
				break;

				case "SELECT":
				this.SKU.push(new SkuSelectionField(skuObject[i]["name"], skuObject[i]["choices"],skuObject[i]["currentValue"]))
				break;

				case "DATE":
				this.SKU.push(new SkuDateField(skuObject[i]["name"], skuObject[i]["separator"]))
				break;

				case "VALUE":
				this.SKU.push(new SkuValueField(skuObject[i]["name"], skuObject[i]["currentValue"]))
				break;

				case "CONST":
				this.SKU.push(new SkuValueConstantField(skuObject[i]["name"], skuObject[i]["currentValue"]))
				break;
			}
		}
		this.mockSku()
		this.validateSku()
		this.changeDetectorRef.detectChanges()
	}

	selectAction(elem, index){
		this.SKU[index]["currentValue"] = elem.target.selectedIndex
		this.saveSku()
	}

	addSelectionToSkuModel() {
		if (this.currentSelectionType === "" || this.currentSelectionType === undefined) {
			this.smallErrorMessage = "You need to select field type";
			return;
		} else {
			this.smallErrorMessage = "";
		}

		switch (this.currentSelectionType) {
			case "ID":
			this.SKU.push(new SkuIdField(this.currentNameOfNewField, 0))
			break;

			case "SELECT":
			this.SKU.push(new SkuSelectionField(this.currentNameOfNewField, "", null))
			break;

			case "DATE":
			this.SKU.push(new SkuDateField(this.currentNameOfNewField, "."))
			break;

			case "VALUE":
			this.SKU.push(new SkuValueField(this.currentNameOfNewField, ""))
			break;

			case "CONST":
			this.SKU.push(new SkuValueConstantField(this.currentNameOfNewField, this.currentNameOfNewField))
			break;
		}
		this.saveSku()
		this.currentNameOfNewField = ""
	}

	moveUp(index) {
		if (parseInt(index) <= 0) {
			return;
		}

		let elemGoingUp: any = this.SKU[index]
		let elemGoingDown: any = this.SKU[index - 1]

		this.SKU[index - 1] = elemGoingUp;
		this.SKU[index] = elemGoingDown;

		this.saveSku()

	}

	moveDown(index) {
		if (parseInt(index) == this.SKU.length - 1) {
			return;
		}

		let elemGoingDown: any = this.SKU[index]
		let elemGoingUp: any = this.SKU[index + 1]

		this.SKU[index] = elemGoingUp
		this.SKU[index + 1] = elemGoingDown

		this.saveSku()

	}

	removeSkuElement(index) {
		this.SKU.splice(parseInt(index), 1)
		this.saveSku()
	}

	trackByIndex(index: number, obj: any) {
		return index;
	}

	saveSku() {
		this.validateSku()
		this.mockSku()
		this._skuStateWhenSaved = JSON.stringify(this.SKU)
		chrome.storage.local.set({ sku: this._skuStateWhenSaved });
	}

	deleteSku(){
		this.SKU = []
		this.saveSku()
	}

	donateClick() {
		chrome.storage.local.set({date: Date.now()})
	}

	mockSku(){
		this.mockedSku = "";
		for(let i = 0 ; i < this.SKU.length; i++) {

			switch(this.SKU[i]["TYPE"]){

				case "ID":
				this.mockedSku = this.mockedSku + this.SKU[i]["currentId"]
				break;

				case "SELECT":
				this.mockedSku = this.mockedSku + this.SKU[i]["name"]
				break;

				case "DATE":
				this.mockedSku = this.mockedSku + this.SKU[i]["name"]
				break;

				case "VALUE":
				this.mockedSku = this.SKU[i]["currentValue"] ? this.mockedSku + this.SKU[i]["currentValue"] : this.mockedSku + this.SKU[i]["name"]
				break;

				case "CONST":
				this.mockedSku = this.SKU[i]["currentValue"] ? this.mockedSku + this.SKU[i]["currentValue"] : this.mockedSku + this.SKU[i]["name"]
				break;
			}
		}
		this.changeDetectorRef.detectChanges()
	}

	validateSku() {
		this.errorList = [];
		for (let i = 0; i < this.SKU.length; i++) {
			switch (this.SKU[i]["TYPE"]) {
				case "ID":

				if (!this.isNumber(this.SKU[i]["currentId"])) {
					this.errorList.push("In ID field " + this.SKU[i].name + ", Current Id must be a number")
				}

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
		this.changeDetectorRef.detectChanges()
	}

	isNumber(val: string): boolean {
		return val != null && val !== '' && !isNaN(Number(val.toString()))
	}
}