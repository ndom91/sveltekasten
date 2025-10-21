<script lang="ts">
import { toast } from "svelte-sonner"
import { useRegisterSW } from "virtual:pwa-register/svelte"

const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
  onRegistered(r: TODO) {
    // uncomment following code if you want check for updates
    // r && setInterval(() => {
    //    console.log('Checking for sw update')
    //    r.update()
    // }, 20000 /* 20s for testing purposes */)
    console.log(`SW Registered: ${r}`)
  },
  onRegisterError(error: TODO) {
    console.log("SW registration error", error)
  },
})

const close = () => {
  offlineReady.set(false)
  needRefresh.set(false)
}

if ($offlineReady || $needRefresh) {
  toast("Event has been created", {
    duration: Number.POSITIVE_INFINITY,
    onDismiss: () => close(),
    cancel: {
      label: "Ignore",
      onClick: () => close(),
    },
    action: {
      label: "Reload",
      onClick: () => updateServiceWorker(true),
    },
  })
}
</script>
