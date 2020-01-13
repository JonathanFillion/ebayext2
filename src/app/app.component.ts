
import { Component, ChangeDetectorRef } from '@angular/core';
import { SkuFieldsTypeList } from './models/SkuExternal/sku-fields-type-list';
import { SkuIdField } from './models/SkuInternals/sku-id-field';
import { SkuSelectionField } from './models/SkuInternals/sku-selection-field';
import { SkuDateField } from './models/SkuInternals/sku-date-field';
import { SkuValueField } from './models/SkuInternals/sku-value-field';
import { SkuValueConstantField } from './models/SkuInternals/sku-value-constant-field';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	currentSelectionType: string;
	currentNameOfNewField: string;
	sfl: SkuFieldsTypeList;
	SKU: any[] = [];
	_skuStateWhenSaved: string;
	isSkuCustomizationActive = true;
	isPrefillingActive = false;
	errorList: string[] = []
	mockedSku: string = ""


	constructor(private changeDetectorRef: ChangeDetectorRef) {
		this.sfl = new SkuFieldsTypeList()
	}

	ngOnInit() {
		chrome.storage.local.get(['sku'], (result) => {
			if(result.sku){
				this.createSkuModelFromJson(result.sku);
			}
		})
	}

	createSkuModelFromJson(skuJson: string) {
		console.log(skuJson)
		let skuObject: any[] = JSON.parse(skuJson);

		for (let i = 0; i < skuObject.length; i++) {
			switch (skuObject[i]["TYPE"]) {
				case "ID":
				this.SKU.push(new SkuIdField(skuObject[i]["name"], skuObject[i]["startPoint"], skuObject[i]["currentId"]))
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
		console.log(this.SKU)
		this.mockSku()
		this.changeDetectorRef.detectChanges()
	}

	selectAction(elem, index){
		this.SKU[index]["currentValue"] = elem.target.selectedIndex
		this.saveSku()
	}

	addSelectionToSkuModel() {
		if (this.currentSelectionType === "" || this.currentSelectionType === undefined) {
			console.log("Display error message")
			return;
		}

		switch (this.currentSelectionType) {
			case "ID":
			this.SKU.push(new SkuIdField(this.currentNameOfNewField, 0, 0))
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
			this.SKU.push(new SkuValueConstantField(this.currentNameOfNewField, ""))
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
				let isNum = true;
				if (!this.isNumber(this.SKU[i]["startPoint"])) {
					this.errorList.push("In ID field " + this.SKU[i].name + ", Start Point must be a number")
					isNum = false
				}
				if (!this.isNumber(this.SKU[i]["currentId"])) {
					this.errorList.push("In ID field " + this.SKU[i].name + ", Current Id must be a number")
					isNum = false;
				}

				if(isNum){
					if(parseInt(this.SKU[i]["startPoint"]) > this.SKU[i]["currentId"]){
						this.errorList.push("In ID field " + this.SKU[i].name + ", Start Point must be bigger than Current ID")
					}
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