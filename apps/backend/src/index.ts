import { serve, type HttpBindings } from '@hono/node-server'
import { Hono } from 'hono'

type Bindings = HttpBindings

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/remote', (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 8000

console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${updateJob.nextRun()}
`)
serve({
  fetch: app.fetch,
  port,
})
