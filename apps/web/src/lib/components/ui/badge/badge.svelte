<script lang="ts">
	import { badgeVariants, type Variant } from ".";
	import { cn } from "$lib/utils/style";

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = "default";
	export { className as class };
</script>

<svelte:element
	this={href ? "a" : "span"}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
