<script lang="ts">
  import { cn } from "$lib/utils"
  import * as Form from "$lib/components/ui/form"
  import * as Popover from "$lib/components/ui/popover"
  import * as Command from "$lib/components/ui/command"
  import { Button } from "$lib/components/ui/button"
  import { languages, formSchema as schema, type FormSchema } from "../../../routes/schema"

  import { tick } from "svelte"
  import toast from "svelte-french-toast"
  import type { SuperValidated } from "sveltekit-superforms"
  import { type FormOptions } from "formsnap"
  import { Check, ChevronsUpDown, Loader2 } from "lucide-svelte"

  let open = false
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  const options: FormOptions<typeof schema> = {
    validators: schema,
    onError: (e) => {
      toast.error(e.result.error.message)
    },
    onUpdated({ form }) {
      if (form.message) {
        // Display the message using a toast library
        toast.success(form.message.text)
        open = false
      }
    },
  }

  export let form: SuperValidated<FormSchema>
</script>

<Form.Root
  debug={true}
  {options}
  {schema}
  {form}
  let:submitting
  let:config
  method="post"
  action="?/quickAdd"
>
  <Form.Field {config} name="title">
    <Form.Item>
      <Form.Label>Title</Form.Label>
      <Form.Input name="title" />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="url">
    <Form.Item>
      <Form.Label>URL</Form.Label>
      <Form.Input name="url" />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Field {config} name="category">
    <Form.Item>
      <Form.Label>Category</Form.Label>
      <Form.Input name="category" />
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
      <Form.Textarea name="description" />
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Button disabled={submitting} class="w-full">
    {#if submitting}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
    {/if}
    <span>Submit</span>
  </Form.Button>
</Form.Root>
