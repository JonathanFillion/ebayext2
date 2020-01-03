import { SkuField } from './sku-field';


export class SkuDateField extends SkuField {

	readonly TYPE = "DATE"
	separator:string;

	constructor(name:string, separator:string){
		super(name)
		this.separator = separator
	}


}
