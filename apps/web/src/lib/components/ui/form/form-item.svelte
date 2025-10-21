<script lang="ts">
import type { HTMLAttributes } from "svelte/elements"
import { cn } from "$lib/utils"

type $$Props = HTMLAttributes<HTMLDivElement>
let className: string | undefined | null
export { className as class }
</script>

<div class={cn("space-y-2", className)} {...$$restProps}>
	<slot />
</div>
