<script lang="ts">
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import * as Card from "$lib/components/ui/card"
  import { clipboard } from "$lib/utils"
</script>

<div class="flex flex-col items-start justify-start gap-2">
  <Card.Root class="w-full">
    <Card.Header class="dark:bg-zinc-900">
      <Card.Title>API Token <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex items-center gap-2">
        For use in the <a href="https://docs.briefkastenhq.com" target="_blank" class="underline">
          briefkasten extension</a
        >
        you can use the following token:
        <div class="flex items-center justify-between rounded-md p-2 font-mono dark:bg-zinc-700">
          {$page.data.session?.user?.userId}
          <button
            use:clipboard={$page.data.session?.user?.userId}
            class="h-8 rounded-md bg-transparent p-1 outline-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <svg
              class="size-4"
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="dark:bg-zinc-900">
      <Card.Title>Import <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-2">
        <p>
          Upload a file exported from another tool, or your browser. Click browse or drop a <code
            >*.html</code
          > file of bookmarks onto the area below. After the file has been uploaded and its name appears
          in the upload widget, you can press Import to start the import process.
        </p>
        <Input id="picture" type="file" />
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="dark:bg-zinc-900">
      <Card.Title>Export <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-2">
        <p>
          Save your bookmarks from Briefkasten to an html file. This is a standardized bookmarks
          format which you can use to import your saved items to any other bookmarks manager or
          browser.
        </p>
        <Button>Save</Button>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="dark:bg-zinc-900">
      <Card.Title>About</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-2">
        <p>
          This is an open-source project written mainly by <a
            href="https://ndo.dev"
            target="blank"
            class="underline">ndom91</a
          >. More information can be found at the links below.
        </p>
        <ul class="list-inside list-disc">
          <li>
            Repository: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten"
              target="_blank">ndom91/briefkasten</a
            >
          </li>
          <li>
            Screenshot API: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-screenshot"
              target="_blank">ndom91/briefkasten-screenshot</a
            >
          </li>
          <li>
            Chrome Extension: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-extension"
              target="_blank">ndom91/briefkasten-extension</a
            >
          </li>
          <li>
            Missing Image Scraping Job: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-scrape"
              target="_blank">ndom91/briefkasten-scrape</a
            >
          </li>
          <li>License: MIT</li>
        </ul>
      </div>
    </Card.Content>
  </Card.Root>
</div>
