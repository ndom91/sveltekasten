<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters"
  import SuperDebug, { fieldProxy, superForm } from "sveltekit-superforms"
  import { toast } from "svelte-sonner"
  import { page } from "$app/stores"
  import { dev } from "$app/environment"

  import { cn } from "$lib/utils/style"
  import { Button } from "$lib/components/ui/button"
  import * as Select from "$lib/components/ui/select"
  import { Label } from "$lib/components/ui/label"
  import { formSchema } from "$schemas/quick-add"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import TagInput from "$lib/components/TagInput.svelte"
  import { useInterface } from "$state/ui.svelte"

  const ui = useInterface()

  const form = superForm($page.data.quickAddForm, {
    dataType: "json",
    customValidity: true,
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success("Bookmark Added")
        ui.toggleMetadataSidebarEditMode()
      }
    },
    onError: ({ result }) => {
      if (result.type === "error") {
        toast.error(result.error.message)
      }
    },
  })
  const { form: formData, errors, constraints, enhance, submitting, delayed } = form
  const categoryProxy = fieldProxy(form, "categoryId", {})
</script>

<form
  id="quickAdd"
  method="POST"
  action="/bookmarks?/quickAdd"
  use:enhance
  class="flex flex-col gap-2"
>
  <div class="flex flex-col gap-2 align-start">
    <Label class="flex justify-between items-end" for="title"
      >Title<small class="text-neutral-400 dark:text-neutral-600">required</small></Label
    >
    <input
      type="text"
      name="title"
      bind:value={$formData.title}
      aria-invalid={$errors.title ? "true" : undefined}
      {...$constraints.title}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.title ? "border-red-300" : "",
      )}
    />
    {#if $errors.title}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
  </div>

  <div class="flex flex-col gap-2 align-start">
    <Label class="flex justify-between items-end" for="url">
      URL
      <small class="text-neutral-400 dark:text-neutral-600">required</small>
    </Label>
    <input
      type="text"
      name="url"
      bind:value={$formData.url}
      aria-invalid={$errors.url ? "true" : undefined}
      {...$constraints.url}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.url ? "border-red-300" : "",
      )}
    />
    {#if $errors.url}<span class="text-xs text-red-400">{$errors.url}</span>{/if}
  </div>

  <div class="flex flex-col gap-2 align-start">
    <Label for="category">Category</Label>
    <Select.Root
      name="categoryId"
      onSelectedChange={(e) => ($categoryProxy = e?.value)}
      items={$page.data?.categories?.map((cat: { id: string, name: string }) => ({
        value: cat.id,
        label: cat.name,
      }))}
    >
      <Select.Trigger
        class="w-full transition-shadow duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none bg-background focus:ring-foreground focus:ring-offset-background"
      >
        <Select.Value placeholder="Choose a category" />
      </Select.Trigger>
      <Select.Content>
        {#each $page.data?.categories as category (category.id)}
          <Select.Item value={category.id}>{category.name}</Select.Item>
        {/each}
      </Select.Content>
      <Select.Input class="bg-background" name="categoryId" />
    </Select.Root>
    {#if $errors.category}<span class="text-xs text-red-400">{$errors.category}</span>{/if}
  </div>

  <div class="flex flex-col gap-2 align-start">
    <Label for="tags">Tags</Label>
    <!-- @ts-ignore -->
    <TagInput {form} tags={$page.data.tags} field="tags" />
  </div>

  <div class="flex flex-col gap-2 align-start">
    <Label for="description">Description</Label>
    <input
      type="text"
      name="description"
      placeholder="Leave blank to use auto-generated"
      bind:value={$formData.description}
      aria-invalid={$errors.description ? "true" : undefined}
      {...$constraints.description}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.description ? "border-red-300" : "",
      )}
    />
    {#if $errors.description}<span class="text-xs text-red-400">{$errors.description}</span>{/if}
  </div>

  <Button
    type="submit"
    disabled={$submitting || $delayed}
    class="transition-shadow duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ring-offset-background focus:ring-foreground focus:ring-offset-background"
  >
    {#if $submitting || $delayed}
      <LoadingIndicator class="mr-2" />
    {/if}
    Submit
  </Button>
  {#if dev}
    <div class="flex flex-col pt-4">
      <SuperDebug data={{ $formData, $errors }} collapsible={true} theme="vscode" />
    </div>
  {/if}
</form>
