import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = (event) => {
  return {
    providers: event.locals.providers
  }
}
