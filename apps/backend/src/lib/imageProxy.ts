import {
  createIPX,
  createIPXWebServer,
  ipxFSStorage,
  ipxHttpStorage,
} from 'ipx';

const ipx = createIPX({
  storage: ipxFSStorage({ dir: './public/' }),
  httpStorage: ipxHttpStorage({
    allowAllDomains: true,
    domains: ['images.unsplash.com']
  }),
});

export const ipxHandler = createIPXWebServer(ipx)

// const app = new Hono().use('/', (c) => createIPXWebServer(ipx)(c.req.raw));
