import { Hono } from "hono"
import { type HttpBindings } from "@hono/node-server"

type Bindings = HttpBindings

const api = new Hono<{ Bindings: Bindings }>()

api.get("/", (c) => {
  return c.text("Hello Hono!")
})

api.get("/remote", (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

export default api
