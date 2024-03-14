import * as esbuild from "esbuild";
import glob from 'tiny-glob';

(async function() {
  const entryPoints = await glob('src/**/*.ts')

  await esbuild.build({
    entryPoints,
    // entryPoints: ['src/index.ts'],
    logLevel: 'info',
    outdir: 'build',
    bundle: true,
    minify: true,
    platform: 'node',
    format: 'cjs',
    sourcemap: true,
  })
})()
