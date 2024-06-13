/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/docs/en/main/file-conventions/entry.client
 */

import { i18n } from "@lingui/core"
import { detect, fromHtmlTag } from "@lingui/detect-locale"
import { I18nProvider } from "@lingui/react"
import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

import { loadCatalog } from "./modules/lingui/lingui"

async function hydrate() {
  const locale = detect(fromHtmlTag("lang")) || "en"

  await loadCatalog(locale)

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <RemixBrowser />
        </I18nProvider>
      </StrictMode>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}
