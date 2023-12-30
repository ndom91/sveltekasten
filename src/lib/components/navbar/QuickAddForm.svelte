<script lang="ts">
  import { melt } from "@melt-ui/svelte"
  import { X } from "lucide-svelte"
  // <!-- import * as Form from "$lib/components/ui/form" -->
  // <!-- import * as Popover from "$lib/components/ui/popover" -->
  // <!-- import * as Command from "$lib/components/ui/command" -->
  // <!-- import { Button } from "$lib/components/ui/button" -->
  import { languages, formSchema as schema, type FormSchema } from "../../../routes/schema"
  import toast from "svelte-french-toast"

  import type { SuperValidated } from "sveltekit-superforms"
  import { type FormOptions } from "formsnap"

  // import { cn } from "$lib/utils"
  import { tick } from "svelte"
  // import { Check, ChevronsUpDown } from "lucide-svelte"
  // import LoadingSpinner from "../LoadingSpinner.svelte"

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
  export let title
  export let description
  export let close
</script>

<!-- <Form.Root debug={false} {options} {schema} {form} let:submitting let:config action="/quick-add"> -->
<!--   <Form.Field {config} name="title"> -->
<!--     <Form.Item> -->
<!--       <Form.Label>Title</Form.Label> -->
<!--       <Form.Input /> -->
<!--       <Form.Validation /> -->
<!--     </Form.Item> -->
<!--   </Form.Field> -->
<!--   <Form.Field {config} name="url"> -->
<!--     <Form.Item> -->
<!--       <Form.Label>URL</Form.Label> -->
<!--       <Form.Input /> -->
<!--       <Form.Validation /> -->
<!--     </Form.Item> -->
<!--   </Form.Field> -->
<!--   <Form.Field {config} name="category"> -->
<!--     <Form.Item> -->
<!--       <Form.Label>Category</Form.Label> -->
<!--       <Form.Input /> -->
<!--       <Form.Validation /> -->
<!--     </Form.Item> -->
<!--   </Form.Field> -->
<!--   <Form.Field {config} name="tags" let:setValue let:value> -->
<!--     <Form.Item> -->
<!--       <Form.Label>Tags</Form.Label> -->
<!--       <Popover.Root bind:open let:ids> -->
<!--         <Popover.Trigger asChild let:builder> -->
<!--           <Form.Control id={ids.trigger} let:attrs> -->
<!--             <Button -->
<!--               builders={[builder]} -->
<!--               {...attrs} -->
<!--               variant="outline" -->
<!--               role="combobox" -->
<!--               type="button" -->
<!--               class={cn("w-full justify-between", !value && "text-muted-foreground")} -->
<!--             > -->
<!--               {languages.find((f) => f.value === value)?.label ?? "Select language"} -->
<!--               <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
<!--             </Button> -->
<!--           </Form.Control> -->
<!--         </Popover.Trigger> -->
<!--         <Popover.Content class="w-[200px] p-0"> -->
<!--           <Command.Root> -->
<!--             <Command.Input autofocus placeholder="Search language..." /> -->
<!--             <Command.Empty>No language found.</Command.Empty> -->
<!--             <Command.Group> -->
<!--               {#each languages as language} -->
<!--                 <Command.Item -->
<!--                   value={language.value} -->
<!--                   onSelect={() => { -->
<!--                     setValue(language.value) -->
<!--                     closeAndFocusTrigger(ids.trigger) -->
<!--                   }} -->
<!--                 > -->
<!--                   <Check -->
<!--                     class={cn("mr-2 h-4 w-4", language.value !== value && "text-transparent")} -->
<!--                   /> -->
<!--                   {language.label} -->
<!--                 </Command.Item> -->
<!--               {/each} -->
<!--             </Command.Group> -->
<!--           </Command.Root> -->
<!--         </Popover.Content> -->
<!--       </Popover.Root> -->
<!--       <Form.Validation /> -->
<!--     </Form.Item> -->
<!--   </Form.Field> -->
<!--   <Form.Field {config} name="description"> -->
<!--     <Form.Item> -->
<!--       <Form.Label>Description</Form.Label> -->
<!--       <Form.Textarea /> -->
<!--       <Form.Validation /> -->
<!--     </Form.Item> -->
<!--   </Form.Field> -->
<!--   <Form.Button disabled={submitting} class="w-full"> -->
<!--     {#if submitting} -->
<!--       <LoadingSpinner size="small" /> -->
<!--     {/if} -->
<!--     <span>Submit</span> -->
<!--   </Form.Button> -->
<!-- </Form.Root> -->

<div>
  <h2 use:melt={title} class="m-0 text-lg font-medium text-black">Edit profile</h2>
  <p use:melt={description} class="mb-5 mt-2 leading-normal text-zinc-600">
    Make changes to your profile here. Click save when you're done.
  </p>

  <fieldset class="mb-4 flex items-center gap-5">
    <label class="w-[90px] text-right text-black" for="name"> Name </label>
    <input
      class="inline-flex h-8 w-full flex-1 items-center justify-center
                    rounded-sm border border-solid px-3 leading-none text-black"
      id="name"
      value="Thomas G. Lopes"
    />
  </fieldset>
  <fieldset class="mb-4 flex items-center gap-5">
    <label class="w-[90px] text-right text-black" for="username"> Username </label>
    <input
      class="inline-flex h-8 w-full flex-1 items-center justify-center
                    rounded-sm border border-solid px-3 leading-none text-black"
      id="username"
      value="@thomasglopes"
    />
  </fieldset>
  <div class="mt-6 flex justify-end gap-4">
    <button
      use:melt={close}
      class="inline-flex h-8 items-center justify-center rounded-sm bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
    >
      Cancel
    </button>
    <button
      use:melt={close}
      class="inline-flex h-8 items-center justify-center rounded-sm bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
    >
      Save changes
    </button>
  </div>
  <button
    use:melt={close}
    aria-label="close"
    class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full p-1 text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400"
  >
    <X class="square-4" />
  </button>
</div>
