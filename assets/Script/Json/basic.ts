import { config } from "../Utility/Config/ConfigDecorator"

 
@config("product_config")
export class Product_config {
	id: string
	name: any
	atlas: any
	icon: any
	type: any
	unlockForOrdersAtOrderNumber: any
	capacityModifier: any
	rewardGold: any
	includeChance: any
	periodCoefficient: any
	amplitudeCoefficient: any
}