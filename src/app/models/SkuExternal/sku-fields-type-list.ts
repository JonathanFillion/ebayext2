import {SkuFieldType} from './sku-field-type';



export class SkuFieldsTypeList {

	listOfFields: SkuFieldType[] = [];

	constructor() {
		this.listOfFields.push(new SkuFieldType("Unique ID", "ID"))
		this.listOfFields.push(new SkuFieldType("Selection Field", "SELECT"))
		this.listOfFields.push(new SkuFieldType("Current Date", "DATE"))
		this.listOfFields.push(new SkuFieldType("Custom Value", "VALUE"))
		this.listOfFields.push(new SkuFieldType("Constant Value", "CONST"))
	}
}
