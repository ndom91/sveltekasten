<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import * as Popover from "$lib/components/ui/popover"
  import * as Command from "$lib/components/ui/command"
  import { Button } from "$lib/components/ui/button"
  import { languages, formSchema as schema, type FormSchema } from "../../../routes/schema"
  import type { SuperValidated } from "sveltekit-superforms"

  import { cn } from "$lib/utils"
  import { tick } from "svelte"
  import { Check, ChevronsUpDown } from "lucide-svelte"

  let open = false
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  export let form: SuperValidated<FormSchema>
</script>

<Form.Root {schema} {form} let:config debug={false} action="/quick-add">
  <Form.Field {config} name="title">
    <Form.Item>
      <Form.Label>Title</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="url">
    <Form.Item>
      <Form.Label>URL</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="category">
    <Form.Item>
      <Form.Label>Category</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="tags" let:setValue let:value>
    <Form.Item>
      <Form.Label>Tags</Form.Label>
      <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
          <Form.Control id={ids.trigger} let:attrs>
            <Button
              builders={[builder]}
              {...attrs}
              variant="outline"
              role="combobox"
              type="button"
              class={cn("w-full justify-between", !value && "text-muted-foreground")}
            >
              {languages.find((f) => f.value === value)?.label ?? "Select language"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Form.Control>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input autofocus placeholder="Search language..." />
            <Command.Empty>No language found.</Command.Empty>
            <Command.Group>
              {#each languages as language}
                <Command.Item
                  value={language.value}
                  onSelect={() => {
                    setValue(language.value)
                    closeAndFocusTrigger(ids.trigger)
                  }}
                >
                  <Check
                    class={cn("mr-2 h-4 w-4", language.value !== value && "text-transparent")}
                  />
                  {language.label}
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="description">
    <Form.Item>
      <Form.Label>Description</Form.Label>
      <Form.Textarea />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Button class="w-full">Submit</Form.Button>
</Form.Root>
