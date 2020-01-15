import { SkuField } from './sku-field';

export class SkuIdField extends SkuField {

	readonly TYPE = "ID"
	//startPoint:number;
	currentId:number;

	constructor(name:string, currentId:number){
		super(name)
		//this.startPoint = startPoint;
		this.currentId = currentId;
	}



}
