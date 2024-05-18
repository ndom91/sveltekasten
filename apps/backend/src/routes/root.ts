import { Hono } from "hono"
import type { HttpBindings } from "@hono/node-server"

const api = new Hono<{ Bindings: HttpBindings }>()

if (process.env.NODE_ENV !== "production") {
  api.get("/remote", (c) => {
    return c.json({
      remoteAddress: c.env.incoming.socket.remoteAddress,
    })
  })
}

export default api
