import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { remixRoutes } from "remix-routes/vite"
import { defineConfig } from "vite"
import { cjsInterop } from "vite-plugin-cjs-interop"
import tsconfigPaths from "vite-tsconfig-paths"

installGlobals()

const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ["remix-i18next"],
  },
  plugins: [
    !isStorybook &&
      remix({
        ignoredRouteFiles: ["**/*.css"],
      }),
    remixRoutes(),
    tsconfigPaths(),
    cjsInterop({
      // List of CJS dependencies that require interop
      dependencies: [],
    }),
  ],
})
