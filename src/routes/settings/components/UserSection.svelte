<script lang="ts">
  import toast from "svelte-french-toast"
  import { page } from "$app/stores"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { Button } from "$lib/components/ui/button"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import * as Card from "$lib/components/ui/card"
  import * as Select from "$lib/components/ui/select"
  import { clipboard } from "$lib/utils/clipboard"
  import { useInterface } from "$state/ui.svelte"
  import { Badge } from "$/lib/components/ui/badge"
  import { TTSLocation } from "$state/ui.svelte"
  import { bookmarkTypes, parseImportFile, importBookmarks, exportBookmarks } from "../utils"
  import { parseChromeBookmarks, parsePocketBookmarks } from "../import"

  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

  const ui = useInterface()

  let exportLoading = $state(false)
  let ttsEnabled = $state($page.data.user?.settings?.ai?.tts?.enabled ?? true)
  let ttsLocation = $state({
    value: $page.data.user?.settings?.ai?.tts?.location.toUpperCase() ?? TTSLocation.SERVER,
    label: capitalize($page.data.user?.settings?.ai?.tts?.location ?? TTSLocation.SERVER),
  })
  let ttsSpeaker = $state({
    value: $page.data.user?.settings?.ai?.tts?.speaker ?? "en-US-GuyNeural",
    label: $page.data.user?.settings?.ai?.tts?.speaker ?? "en-US-GuyNeural",
  })
  let summarizationEnabled = $state($page.data.user?.settings?.ai?.summarization?.enabled ?? true)
  let transcriptionEnabled = $state($page.data.user?.settings?.ai?.transcription?.enabled ?? true)

  type UpdateUserSettingsArgs = {
    ttsEnabled: boolean
    ttsSpeaker: string
    ttsLocation: string
    summarizationEnabled: boolean
    transcriptionEnabled: boolean
  }
  const updateUser = async (userSettings: UpdateUserSettingsArgs) => {
    const userUpdateResponse = await fetch("/api/v1/user", {
      method: "PUT",
      body: JSON.stringify({
        data: {
          settings: {
            ai: {
              tts: {
                enabled: userSettings.ttsEnabled,
                speaker: userSettings.ttsSpeaker,
                location: userSettings.ttsLocation,
              },
              summarization: {
                enabled: userSettings.summarizationEnabled,
              },
              transcription: {
                enabled: userSettings.transcriptionEnabled,
              },
            },
          },
        },
      }),
    })
    if (userUpdateResponse.ok) {
      // TODO: Reenable when not running onMount
      // toast.success("Settings updated")
    }
  }

  const speakers = [
    "en-US-AriaNeural",
    "en-US-AnaNeural",
    "en-US-ChristopherNeural",
    "en-US-EricNeural",
    "en-US-GuyNeural",
    "en-US-JennyNeural",
    "en-US-MichelleNeural",
    "en-US-RogerNeural",
    "en-US-SteffanNeural",
  ]

  $effect(() => {
    // TODO: do not fire onMount, only on subscribed values change
    updateUser({
      ttsEnabled: ttsEnabled,
      ttsSpeaker: ttsSpeaker.label?.trim(),
      ttsLocation: ttsLocation.label?.trim(),
      summarizationEnabled: summarizationEnabled,
      transcriptionEnabled: transcriptionEnabled,
    })
  })

  const ttsSelectValues = Object.keys(TTSLocation).map((location) => ({
    value: location,
    label: capitalize(location),
  }))

  let importFile = $state<TODO>(null)
  let bookmarksPreview = $state<TODO>([])

  $inspect("file", importFile)
  $inspect("bookmarksPreview", bookmarksPreview)

  $effect(() => {
    if (!importFile) return
    console.log("importFile", importFile)
    console.log("importFile[0]", importFile[0])
    console.log("importFile.typeof[0]", typeof importFile[0])
    const fileReader = new FileReader()
    fileReader.readAsText(importFile[0])
    fileReader.onloadend = (e) => {
      console.log("fileReader.onloadend.e", e)
      const htmlFile = e?.currentTarget?.result
      if (!htmlFile) return

      const parsedFile = parseImportFile(htmlFile)
      if (!parsedFile) return

      if (parsedFile.type === bookmarkTypes.POCKET) {
        bookmarksPreview = parsePocketBookmarks(parsedFile.doc)
      } else if (parsedFile.type === bookmarkTypes.CHROME) {
        // Default Chrome format
        bookmarksPreview = parseChromeBookmarks(parsedFile.doc)
      }
    }
  })

  const handleImport = () => {
    importBookmarks(importFile)
  }

  const handleBookmarkExport = () => {
    exportLoading = true
    exportBookmarks($page.data.bookmarks.data)
    exportLoading = false
  }
</script>

<div class="flex flex-col gap-2 justify-start items-start h-full">
  <Card.Root class="w-full">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title>API Token <i>TODO</i></Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex gap-2 items-center">
        For use in the <a
          href="https://docs.briefkastenhq.com"
          target="_blank"
          class="underline underline-offset-4"
        >
          Briefkasten Extension</a
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
        <Badge class="text-sm">Experimental</Badge>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          You can manage all of your AI features here. All of these AI features that run in the
          browser are enabled by the <a
            class="underline underline-offset-4"
            href="https://github.com/xenova/transformers.js">transformers.js</a
          >
          library from
          <a class="underline underline-offset-4" href="https://huggingface.co" target="_blank"
            >Huggingface</a
          >, meaning
          <b>the models are downloaded locally and run in your browser</b> when selecting "Read Aloud"
          on an RSS feed ite, for example.
        </p>
        <p>
          That has the advantage of significantly increased security and no need for a third-party
          API key. However, it also comes with some disadvantages like lower performance and longer
          inference times. So be aware, the AI features are all in an experimental stage, but we
          really wanted to share them with you all already anyway!
        </p>
        <div class="flex flex-col gap-4 items-start">
          <div class="flex gap-4 items-center">
            <Checkbox id="summarization" bind:checked={summarizationEnabled} />
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
            <Checkbox id="tts" bind:checked={ttsEnabled} />
            <div>
              <div class="flex flex-col gap-4 text-neutral-400 dark:text-neutral-500">
                <label for="tts" class="flex flex-col gap-2">
                  <div class="text-xl text-neutral-800 dark:text-neutral-50">Text to Speech</div>
                  <p>
                    In the browser, our text-to-speech (TTS) feature is using the <code
                      >Xenova/speecht5_tts</code
                    > model and takes about ~10s on average to generate good quality voice audio for
                    each sentence of text. Therefore, this option is really only good for experimentation
                    at this point.
                  </p>
                  <p>
                    However, we also support a "Server" mode which leverages the Edge browser LLM
                    APIs for text-to-speech generation. This not only performs significantly better,
                    but it also supports choosing one of a dozen voices. You can adjust the method
                    (browser / server) below, as well as select a voice if you've chosen the server
                    text-to-speed option.
                  </p>
                </label>
                <div class="flex gap-2 justify-start items-center">
                  <div class="flex flex-col gap-2 w-56">
                    <label
                      for="ttsLocation"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-invalid:text-destructive text-neutral-800 dark:text-neutral-50"
                      >Method</label
                    >
                    <Select.Root
                      name="ttsLocation"
                      items={ttsSelectValues}
                      bind:selected={ttsLocation}
                    >
                      <Select.Trigger class="w-full disabled:cursor-default enabled:bg-zinc-950">
                        <Select.Value placeholder="TTS Inference Location" />
                      </Select.Trigger>
                      <Select.Input />
                      <Select.Content>
                        {#each ttsSelectValues as location}
                          <Select.Item value={location.value}>{location.label}</Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                  <div class="flex flex-col gap-2 w-56">
                    <label
                      for="ttsSpeaker"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-invalid:text-destructive text-neutral-800 dark:text-neutral-50"
                      >Voice</label
                    >
                    <Select.Root
                      name="ttsSpeaker"
                      items={speakers.map((speaker) => ({
                        value: speaker,
                        label: speaker,
                      }))}
                      disabled={ttsLocation.value !== TTSLocation.SERVER}
                      bind:selected={ttsSpeaker}
                    >
                      <Select.Trigger
                        class="w-full disabled:cursor-not-allowed enabled:bg-zinc-950"
                      >
                        <Select.Value placeholder="Speaker" />
                      </Select.Trigger>
                      <Select.Input />
                      <Select.Content>
                        {#each speakers as speaker}
                          <Select.Item value={speaker}>{speaker}</Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="flex gap-4 items-center"> -->
          <!--   <Checkbox id="transcriber" bind:checked={transcriptionEnabled} /> -->
          <!--   <label for="transcriber" class=""> -->
          <!--     <div class="text-xl">Transcriber</div> -->
          <!--     <div class="text-neutral-400 dark:text-neutral-500"> -->
          <!--       Our speech to text (transcriber) feature is using the <code -->
          <!--         >Xenova/whisper-tiny</code -->
          <!--       > -->
          <!--       model and takes about ~20s on average after recording has stopped to generate a fairly -->
          <!--       accurate transcription. We feel comfortable recommending this one for daily use in notes. -->
          <!--       Note: We currently only support transcription in <b>English</b>. -->
          <!--     </div> -->
          <!--   </label> -->
          <!-- </div> -->
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title class="flex justify-between items-center w-full">
        <span>Import</span>
        <Badge class="bg-amber-200">TODO</Badge>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          Upload a bookmarks HTML file exported from another tool, or your browser. After the file
          has been uploaded and its name appears in the upload widget, you can press Import to start
          the import process.
        </p>
        <input
          accept="text/html"
          id="import-bookmarks"
          type="file"
          class="flex py-2 px-3 w-full max-w-sm h-10 text-sm bg-transparent rounded-md border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-input ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-ring"
          bind:files={importFile}
        />
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full">
    <Card.Header class="bg-zinc-100 dark:bg-zinc-900">
      <Card.Title class="flex justify-between items-center w-full">
        <span>Export</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          Save your bookmarks from Briefkasten to an html file. This is a standardized bookmarks
          format which you can use to import your saved items to any other bookmarks manager or
          browser.
        </p>
        <Button onclick={handleBookmarkExport} disabled={exportLoading}>
          {#if exportLoading}
            <LoadingIndicator class="mr-2" />
          {/if}
          Export Bookmark File
        </Button>
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
            class="underline underline-offset-4">ndom91</a
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
