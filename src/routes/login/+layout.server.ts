import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals, url }) => {
  const redirectTo = url.searchParams.get('redirectTo')
  return {
    providers: locals.providers,
    redirectTo
  }
}
