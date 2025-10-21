<script lang="ts">
import type { Select as SelectPrimitive } from "bits-ui"
import { getFormField } from "formsnap"
import * as Select from "$lib/components/ui/select"

type $$Props = SelectPrimitive.Props<unknown>
const { setValue, name, value } = getFormField()
export let onSelectedChange: $$Props["onSelectedChange"] = undefined
</script>

<Select.Root
	onSelectedChange={(v) => {
		onSelectedChange?.(v);
		setValue(v ? v.value : undefined);
	}}
	{...$$restProps}
>
	<slot />
	<input hidden {name} value={$value} />
</Select.Root>
