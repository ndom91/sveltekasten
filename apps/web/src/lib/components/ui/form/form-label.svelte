<script lang="ts">
	import { getFormField } from "formsnap";
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils/style";
	import type { Label as LabelPrimitive } from "bits-ui";

	type $$Props = LabelPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export { className as class };

	const { errors, ids } = getFormField();
</script>

<Label
	for={$ids.input}
	class={cn($errors && "text-destructive", className)}
	{...$$restProps}
>
	<slot />
</Label>
