<script lang="ts">
	import { getFormField } from "formsnap";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import type { Checkbox as CheckboxPrimitive } from "bits-ui";
	type $$Props = CheckboxPrimitive.Props;
	type $$Events = CheckboxPrimitive.Events;

	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;

	const { name, setValue, attrStore, value } = getFormField();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name: nameAttr, value: valueAttr, ...rest } = $attrStore;
</script>

<Checkbox
	{...rest}
	checked={typeof $value === "boolean" ? $value : false}
	onCheckedChange={(v) => {
		onCheckedChange?.(v);
		setValue(v);
	}}
	{...$$restProps}
	on:click
	on:keydown
/>
<input hidden {name} value={$value} />
