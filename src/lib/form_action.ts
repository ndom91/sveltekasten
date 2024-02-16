import { dev } from "$app/environment"
import { applyAction } from "$app/forms"
import { invalidateAll } from "$app/navigation"
import toast from "svelte-french-toast"
// import { loading } from '$state/loading';
import type { ActionResult } from "@sveltejs/kit"

type FormActionMessage = {
  message?: string
}

export const form_action = (_opts?: FormActionMessage, callback?: (data: any | unknown) => any) => {
  return function form_enhance() {
    // loading.setLoading(true);
    return async ({ result }: { result: ActionResult<{ message: string }> }) => {
      dev && console.log(result)
      if (result.type === "success") {
        toast.success(result?.data?.message ?? "Success")
      } else if (result.type === "error") {
        toast.error(`Error: ${result.error.message}`, { icon: "🚫" })
        dev && console.log(result)
      } else {
        toast.error("Something went wrong. Check the console", { icon: "🚫" })
        dev && console.log(result)
      }
      await invalidateAll()
      await applyAction(result)
      // loading.setLoadingcfalse);
      if (callback && "data" in result && result?.data) callback(result.data)
    }
  }
}
