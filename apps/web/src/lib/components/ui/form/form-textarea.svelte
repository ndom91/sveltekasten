<script lang="ts">
	import { getFormField } from "formsnap";
	import {
		Textarea,
		type TextareaEvents
	} from "$lib/components/ui/textarea";
	import type { TextareaGetFormField } from ".";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	type $$Props = HTMLTextareaAttributes;
	type $$Events = TextareaEvents;

	const { attrStore, value } = getFormField() as TextareaGetFormField;
</script>

<Textarea
	{...$attrStore}
	bind:value={$value}
	{...$$restProps}
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
/>
