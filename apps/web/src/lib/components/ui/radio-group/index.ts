import Item from "./radio-group-item.svelte";
import Root from "./radio-group.svelte";
import { RadioGroup as RadioGroupPrimitive } from "bits-ui";

const Input = RadioGroupPrimitive.Input;

export {
	Root,
	Input,
	Item,
	//
	Root as RadioGroup,
	Input as RadioGroupInput,
	Item as RadioGroupItem
};
