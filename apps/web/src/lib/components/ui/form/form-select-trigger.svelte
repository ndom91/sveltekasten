<script lang="ts">
import type { Select as SelectPrimitive } from "bits-ui"
import { getFormField } from "formsnap"
import * as Select from "$lib/components/ui/select"

type $$Props = SelectPrimitive.TriggerProps & {
  placeholder?: string
}
type $$Events = SelectPrimitive.TriggerEvents
const { attrStore } = getFormField()
export let placeholder = ""
</script>

<Select.Trigger
	{...$$restProps}
	{...$attrStore}
	on:click
	on:keydown
	type="button"
>
	<Select.Value {placeholder} />
	<slot />
</Select.Trigger>
