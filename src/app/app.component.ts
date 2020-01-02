import { Component } from '@angular/core';
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



	constructor() {
		this.sfl = new SkuFieldsTypeList()
	}

	ngOnInit() {

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
			this.SKU.push(new SkuSelectionField(this.currentNameOfNewField))
			break;

			case "DATE":
			this.SKU.push(new SkuDateField(this.currentNameOfNewField))
			break;

			case "VALUE":
			this.SKU.push(new SkuValueField(this.currentNameOfNewField))
			break;  		  		
		}

	}

	trackByIndex(index:number, obj:any){
		return index;
	}

}
