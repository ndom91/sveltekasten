<script lang="ts">
  // import { untrack, onMount } from "svelte"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import * as Card from "$lib/components/ui/card"
  import { clipboard } from "$lib/utils/clipboard"
  import { useInterface } from "$state/ui.svelte"
  import { Badge } from "$/lib/components/ui/badge"

  $inspect($page.data)

  const ui = useInterface()

  let ttsEnabled = $state($page.data.user?.settings?.ai?.tts ?? true)
  let summarizationEnabled = $state($page.data.user?.settings?.ai?.tts ?? true)
  let transcriptionEnabled = $state($page.data.user?.settings?.ai?.tts ?? true)

  // TODO: Send correct updated checkbox state per individual checkbox
  async function handleSettingsUpdate(e: string | boolean) {
    try {
      console.log("handleSettingsUpdate", e)
      await fetch("/api/v1/user", {
        method: "PUT",
        body: JSON.stringify({
          data: {
            settings: {
              ai: {
                tts: ttsEnabled,
                summarization: summarizationEnabled,
                transcription: transcriptionEnabled,
              },
            },
          },
        }),
      })
    } catch (error: any) {
      console.error(error)
    }
  }
</script>

<div class="flex flex-col gap-2 justify-start items-start">
  <Card.Root class="w-full">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>API Token <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex gap-2 items-center">
        For use in the <a href="https://docs.briefkastenhq.com" target="_blank" class="underline">
          briefkasten extension</a
        >
        you can use the following token:
        <div
          class="flex justify-between items-center p-2 font-mono rounded-md bg-zinc-100 dark:bg-zinc-700"
        >
          {$page.data?.session?.user?.userId}
          <button
            use:clipboard={$page.data?.session?.user?.userId ?? ""}
            class="p-1 h-8 bg-transparent rounded-md outline-none focus:ring-2 focus:outline-none focus:ring-zinc-300"
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
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title class="flex justify-between items-center w-full">
        <span>AI Settings</span>
        <Badge>Experimental</Badge>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          You can manage any of the AI features here. All of these AI features are enabled by the <a
            class="underline"
            href="https://github.com/xenova/transformers.js">transformers.js</a
          >
          library, meaning <b>the models are downloaded and run in your browser</b>. That has the
          advantage of significantly increased security and no need for a third-party API key. That
          means it also comes with the disadvantage of lower performance / longer inference times.
          These are all in an experimental stage, but we wanted to share them anyway!
        </p>
        <div class="flex flex-col gap-4 items-start">
          <div class="flex gap-4 items-center">
            <Checkbox
              id="summarization"
              onCheckedChange={handleSettingsUpdate}
              bind:checked={summarizationEnabled}
            />
            <div>
              <label for="summarization" class="">
                <div class="text-xl">Summarization</div>
                <div class="text-neutral-400 dark:text-neutral-500">
                  Our summaries feature is using the <code>Xenova/distilbart-cnn-6-6</code> model and
                  takes about ~30s on average to summarize a medium length article. We recommend this
                  one for day-to-day use.
                </div>
              </label>
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <Checkbox id="tts" onCheckedChange={handleSettingsUpdate} bind:checked={ttsEnabled} />
            <label for="tts" class="">
              <div class="text-xl">Text to Speech</div>
              <div class="text-neutral-400 dark:text-neutral-500">
                Our text-to-speech feature is using the <code>Xenova/speecht5_tts</code> model and takes
                about ~10s on average to generate good quality voice audio for each sentence of text.
                Therefore, this model is really only good for experimentation at this point. Generating
                the voice data for a while article / post is not feasible at the moment.
              </div>
            </label>
          </div>
          <div class="flex gap-4 items-center">
            <Checkbox
              id="transcriber"
              onCheckedChange={handleSettingsUpdate}
              bind:checked={transcriptionEnabled}
            />
            <label for="transcriber" class="">
              <div class="text-xl">Transcriber</div>
              <div class="text-neutral-400 dark:text-neutral-500">
                Our speech to text (transcriber) feature is using the <code
                  >Xenova/whisper-tiny</code
                >
                model and takes about ~20s on average after recording has stopped to generate a fairly
                accurate transcription. We feel comfortable recommending this one for daily use in notes.
                Note: We currently only support transcription in <b>English</b>.
              </div>
            </label>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>Import <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
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
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>Export <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
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
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>About</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          This is an open-source project written mainly by <a
            href="https://ndo.dev"
            target="blank"
            class="underline">ndom91</a
          >. More information can be found at the links below.
        </p>
        <ul class="list-disc list-inside">
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
