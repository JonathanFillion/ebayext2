export class Prefills {
	condition: string;
	price: string;
	size1	: string;
	size2	: string;
	size3	: string;
	lwu	: string;
	swu: string;

	constructor(condition: string ="",price: string="",
		size1: string="",size2: string="",size3: string="",lwu: string="",swu: string=""){
		this.condition = condition;
		this.price = price;
		this.size1 = size1
		this.size2 = size2
		this.size3 = size3
		this.lwu = lwu 
		this.swu = swu
	}
}