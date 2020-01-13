import { SkuField } from './sku-field';

export class SkuSelectionField extends SkuField{

	readonly TYPE = "SELECT"
	choices: string;
	currentValue: string;

	constructor(name:string, choices:string, currentValue:string) {
		super(name)
		this.choices = choices
		this.currentValue = currentValue;
	}
}
