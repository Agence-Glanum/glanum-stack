import { i18n } from "@lingui/core"
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { useEffect } from "react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"

import { getUser } from "~/domains/auth/services/session.server"
import { useIsBot } from "~/hooks/use-is-bot"
import { useTernaryDarkMode } from "~/hooks/use-ternary-dark-mode"
import { loadCatalog, useLocale } from "~/modules/lingui/lingui"
import { linguiServer, localeCookie } from "~/modules/lingui/lingui.server"
import stylesheet from "~/tailwind.css?url"
import { csrf } from "~/utils/csrf.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const locale = formData.get("locale") ?? "en"

  return json(null, {
    headers: {
      "Set-Cookie": await localeCookie.serialize(locale),
    },
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [token, cookieHeader] = await csrf.commitToken()

  if (!cookieHeader) {
    throw json("Server error", { status: 500 })
  }

  const user = await getUser(request)

  const locale = await linguiServer.getLocale(request)

  return typedjson(
    {
      // prevent token leak in browser
      user: user ? { ...user, token: "" } : undefined,
      locale,
      csrf: token,
      env: process.env.APP_ENV,
    },
    {
      headers: [
        ["Set-Cookie", cookieHeader],
        ["Set-Cookie", await localeCookie.serialize(locale)],
      ],
    },
  )
}

export type RootLoaderType = typeof loader

export default function App() {
  const { csrf } = useTypedLoaderData<typeof loader>()

  const isBot = useIsBot()
  const { isDarkMode } = useTernaryDarkMode()

  useEffect(() => {
    const body = document.querySelector("body")

    if (body) {
      isDarkMode ? body.classList.add("dark") : body.classList.remove("dark")
    }
  }, [isDarkMode])

  const locale = useLocale()

  useEffect(() => {
    if (i18n.locale !== locale) {
      loadCatalog(locale)
    }
  }, [locale])

  return (
    <html lang={locale ?? "en"} className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <AuthenticityTokenProvider token={csrf}>
          <Outlet />
        </AuthenticityTokenProvider>
        <ScrollRestoration />
        {isBot ? null : <Scripts />}
      </body>
    </html>
  )
}
