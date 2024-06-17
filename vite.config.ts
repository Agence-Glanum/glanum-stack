import { lingui } from "@lingui/vite-plugin"
import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { defineConfig } from "vite"
import macrosPlugin from "vite-plugin-babel-macros"
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
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
    macrosPlugin(),
    lingui(),
    tsconfigPaths(),
  ],
})
