<script lang="ts">
  import { cn } from "$lib/utils/style"
  import { Button } from "$lib/components/ui/button/index.js"
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
  import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import * as Select from "$lib/components/ui/select/index.js"
  import { watch } from "runed"
  import type { DateRange } from "bits-ui"

  const df = new DateFormatter("en-US", {
    dateStyle: "medium",
  })

  let start = $state(today(getLocalTimeZone()).subtract({ days: 3 }))
  let end = $state(today(getLocalTimeZone()))
  let dateRange = $state<DateRange>({ start, end })
  const userLocale: string = $state(new Intl.NumberFormat().resolvedOptions().locale ?? "en-us")

  const items = [
    { value: 3, label: "Last 3 Days" },
    { value: 7, label: "Last Week" },
    { value: 30, label: "Last Month" },
  ]

  // TODO: Fix up this hacky reactivity-keep-in-sync BS
  watch(
    () => [start, end],
    () => {
      dateRange = {
        start,
        end,
      }
    },
  )
  watch(
    () => dateRange,
    () => {
      start = dateRange.start
      end = dateRange.end
    },
  )
</script>

<div class="grid gap-2 flex-grow">
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button
        variant="outline"
        class={cn(
          "w-fit justify-start text-left font-normal",
          !start && !end && "text-muted-foreground",
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
        {#if start}
          {#if end}
            {df.format(start.toDate(getLocalTimeZone()))} - {df.format(
              end.toDate(getLocalTimeZone()),
            )}
          {:else}
            {df.format(start.toDate(getLocalTimeZone()))}
          {/if}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-2 space-y-2" align="start">
      <Select.Root
        {items}
        selected={items[0]}
        onSelectedChange={(v) => {
          if (!v) return
          // daysCount = v.value
          start = today(getLocalTimeZone()).subtract({ days: v.value })
          end = today(getLocalTimeZone())
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select" />
        </Select.Trigger>
        <Select.Content>
          {#each items as item}
            <Select.Item value={item.value}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <RangeCalendar locale={userLocale} bind:value={dateRange} initialFocus />
    </Popover.Content>
  </Popover.Root>
</div>
