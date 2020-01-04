import { Component, ChangeDetectorRef } from '@angular/core';
import { SkuFieldsTypeList } from './models/SkuExternal/sku-fields-type-list';
import { SkuIdField } from './models/SkuInternals/sku-id-field';
import { SkuSelectionField } from './models/SkuInternals/sku-selection-field';
import { SkuDateField } from './models/SkuInternals/sku-date-field';
import { SkuValueField } from './models/SkuInternals/sku-value-field';

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
	constructor(private changeDetectorRef: ChangeDetectorRef) {
		this.sfl = new SkuFieldsTypeList()
	}

	ngOnInit() {
		chrome.storage.local.get(['sku'], (result) => {
			this.createSkuModelFromJson(result.sku);
		})
	}

	createSkuModelFromJson(skuJson:string){
		let skuObject: any[] = JSON.parse(skuJson);
		console.log(skuObject)
		for(let i = 0 ; i < skuObject.length;i++){
			switch(skuObject[i]["TYPE"]) {
				case "ID":
				this.SKU.push(new SkuIdField(skuObject[i]["name"],skuObject[i]["startPoint"],skuObject[i]["currentId"]))
				break;

				case "SELECT":
				this.SKU.push(new SkuSelectionField(skuObject[i]["name"], skuObject[i]["choices"]))
				break;

				case "DATE":
				this.SKU.push(new SkuDateField(skuObject[i]["name"], skuObject[i]["separator"]))
				break;

				case "VALUE":
				this.SKU.push(new SkuValueField(skuObject[i]["name"], skuObject[i]["currentValue"]))
				break;  		  		
			}
		}
		this.changeDetectorRef.detectChanges()
	}


	addSelectionToSkuModel(){
		if(this.currentSelectionType === "" || this.currentSelectionType === undefined){
			console.log("Display error message")
			return;
		}

		switch(this.currentSelectionType) {
			case "ID":
			this.SKU.push(new SkuIdField(this.currentNameOfNewField,0,0))
			break;

			case "SELECT":
			this.SKU.push(new SkuSelectionField(this.currentNameOfNewField, ""))
			break;

			case "DATE":
			this.SKU.push(new SkuDateField(this.currentNameOfNewField, "."))
			break;

			case "VALUE":
			this.SKU.push(new SkuValueField(this.currentNameOfNewField, ""))
			break;  		  		
		}

	}

	showSkuCustomization(){
		this.isPrefillingActive = false;
		this.isSkuCustomizationActive = true;
	}

	showPrefilling(){
		this.isPrefillingActive = true;
		this.isSkuCustomizationActive = false;
	}

	moveUp(index){
		if(parseInt(index) <= 0){
			return;
		}

		let elemGoingUp: any = this.SKU[index]
		let elemGoingDown: any = this.SKU[index - 1]
		
		this.SKU[index - 1] = elemGoingUp;
		this.SKU[index] = elemGoingDown;

	}

	moveDown(index){
		if(parseInt(index) == this.SKU.length -1){
			return;
		}

		let elemGoingDown: any = this.SKU[index]
		let elemGoingUp: any = this.SKU[index + 1]

		this.SKU[index] = elemGoingUp 
		this.SKU[index+1] = elemGoingDown 

	}

	removeSkuElement(index){
		this.SKU.splice(parseInt(index), 1)
	}

	trackByIndex(index:number, obj:any){
		return index;
	}

	saveSku(){
		console.log(JSON.stringify(this.SKU))
		this._skuStateWhenSaved = JSON.stringify(this.SKU)
		chrome.storage.local.set({sku: this._skuStateWhenSaved});
	}

}
