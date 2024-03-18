import { Hono } from "hono"
// import { cors } from "hono/cors"
import { type HttpBindings } from "@hono/node-server"

type Bindings = HttpBindings

const api = new Hono<{ Bindings: Bindings }>()
// TODO: Reenable
// api.use("/*", cors())

api.get("/", (c) => {
  return c.text("Hello Hono!")
})

api.get("/remote", (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

export default api
