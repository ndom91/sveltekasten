<script lang="ts">
  import { page } from "$app/stores"
  import { dev } from "$app/environment"

  import { cn } from "$lib/utils"
  import * as Form from "$lib/components/ui/form"
  import * as Popover from "$lib/components/ui/popover"
  import * as Command from "$lib/components/ui/command"
  import { Button } from "$lib/components/ui/button"
  import { Label } from "$lib/components/ui/label"
  import { Input } from "$lib/components/ui/input"
  import { languages, formSchema as schema, type FormSchema } from "../../../routes/schema"
  import { superForm } from "sveltekit-superforms/client"
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte"

  import { tick } from "svelte"
  import toast from "svelte-french-toast"
  import type { SuperValidated } from "sveltekit-superforms"
  import { type FormOptions } from "formsnap"
  import { Check, ChevronsUpDown, Loader2 } from "lucide-svelte"

  // let form: SuperValidated<FormSchema> = $page.data.form
  // console.log("quickaddform.form", form)
  let open = false

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  // const options: FormOptions<typeof schema> = {
  //   validators: schema,
  //   onError: (e) => {
  //     toast.error(e.result.error.message)
  //   },
  //   onUpdated({ form }) {
  //     if (form.message) {
  //       // Display the message using a toast library
  //       toast.success(form.message.text)
  //       open = false
  //     }
  //   },
  // }

  const { form, errors, constraints, enhance, submitting, delayed } = superForm($page.data.form, {
    onUpdated: ({ form }) => {
      console.log("onUpdated.form.message", form.message)
      if (form.message?.text) {
        toast.success(form.message.text)
      }
      open = false
    },
  })
</script>

<form method="post" action="?/quickAdd" use:enhance class="flex flex-col gap-2">
  <div class="align-start flex flex-col gap-2">
    <Label for="title">Title</Label>
    <input
      type="text"
      name="title"
      bind:value={$form.title}
      aria-invalid={$errors.title ? "true" : undefined}
      {...$constraints.title}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        $errors.title ? "border-red-300" : "",
      )}
    />
    {#if $errors.title}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="url">URL</Label>
    <input
      type="text"
      name="url"
      bind:value={$form.url}
      aria-invalid={$errors.url ? "true" : undefined}
      {...$constraints.url}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        $errors.url ? "border-red-300" : "",
      )}
    />
    {#if $errors.url}<span class="text-xs text-red-400">{$errors.url}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="category">Category</Label>
    <input
      type="text"
      name="category"
      bind:value={$form.category}
      aria-invalid={$errors.category ? "true" : undefined}
      {...$constraints.category}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        $errors.category ? "border-red-300" : "",
      )}
    />
    {#if $errors.category}<span class="text-xs text-red-400">{$errors.category}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="description">Description</Label>
    <input
      type="text"
      name="description"
      bind:value={$form.description}
      aria-invalid={$errors.description ? "true" : undefined}
      {...$constraints.description}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        $errors.description ? "border-red-300" : "",
      )}
    />
    {#if $errors.description}<span class="text-xs text-red-400">{$errors.description}</span>{/if}
  </div>

  <Button type="submit" disabled={$submitting || $delayed}>
    {#if $submitting || $delayed}
      <Loader2 class="mr-2 h-4 w-4 animate-spin text-muted" color="#27272a" />
    {/if}
    Submit
  </Button>
  {#if dev}
    <SuperDebug data={$form} />
  {/if}
</form>
