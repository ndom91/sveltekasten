<script lang="ts">
  import { format, parse, addMonth } from "@formkit/tempo"
  import { cn } from "$lib/utils/style"
  import { Button } from "$lib/components/ui/button/index.js"
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"

  let value = {
    start: addMonth(new Date().toISOString(), -1),
    end: new Date().toISOString(),
  }

  console.log("dateValue", value)

  let startValue: Date | undefined = $state(undefined)
</script>

<div class="grid gap-2">
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button
        variant="outline"
        class={cn(
          "w-[300px] justify-start text-left font-normal",
          !value && "text-muted-foreground",
        )}
        builders={[builder]}
      >
        <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
          ><rect width="256" height="256" fill="none" /><rect
            x="40"
            y="40"
            width="176"
            height="176"
            rx="8"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="176"
            y1="24"
            x2="176"
            y2="56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="80"
            y1="24"
            x2="80"
            y2="56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="40"
            y1="88"
            x2="216"
            y2="88"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><circle cx="128" cy="132" r="12" /><circle cx="172" cy="132" r="12" /><circle
            cx="84"
            cy="172"
            r="12"
          /><circle cx="128" cy="172" r="12" /><circle cx="172" cy="172" r="12" /></svg
        >
        {#if value && value.start}
          {#if value.end}
            {format(value.start)} - {format(value.end)}
          {:else}
            {format(value.start)}
          {/if}
        {:else if startValue}
          {format(startValue)}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        bind:startValue
        initialFocus
        numberOfMonths={2}
        placeholder={value?.start}
      />
    </Popover.Content>
  </Popover.Root>
</div>
