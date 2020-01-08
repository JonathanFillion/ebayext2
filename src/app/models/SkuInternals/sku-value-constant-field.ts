import { SkuField } from './sku-field';


export class SkuValueConstantField extends SkuField {

	readonly TYPE = "CONST"
	currentValue:string;


	constructor(name:string, currentValue:string){
		super(name)
		this.currentValue = currentValue;
	}





}
