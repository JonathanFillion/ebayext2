import { SkuField } from './sku-field';

export class SkuSelectionField extends SkuField{

	readonly TYPE = "SELECT"
	choices: string;

	constructor(name:string, choices:string) {
		super(name)
		this.choices = choices
	}
}
