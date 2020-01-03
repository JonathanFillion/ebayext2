import { SkuField } from './sku-field';


export class SkuValueField extends SkuField {

	readonly TYPE = "VALUE"
	currentValue:string;


	constructor(name:string, currentValue:string){
		super(name)
		this.currentValue = currentValue;
	}





}
