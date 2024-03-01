import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useChangeLanguage } from "remix-i18next/react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"

import { getUser } from "~/domains/auth/services/session.server"
import { useIsBot } from "~/hooks/use-is-bot"
import { useTernaryDarkMode } from "~/hooks/use-ternary-dark-mode"
import i18next from "~/i18next.server"
import stylesheet from "~/tailwind.css?url"
import { csrf } from "~/utils/csrf.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request)
  const [token, cookieHeader] = await csrf.commitToken()

  if (!cookieHeader) {
    throw json("Server error", { status: 500 })
  }

  const user = await getUser(request)

  return typedjson(
    {
      // prevent token leak in browser
      user: user ? { ...user, token: "" } : undefined,
      locale,
      csrf: token,
      env: process.env.APP_ENV,
    },
    { headers: { "set-cookie": cookieHeader } },
  )
}

export default function App() {
  const { locale, csrf } = useTypedLoaderData<typeof loader>()

  useChangeLanguage(locale)
  const { i18n } = useTranslation()
  const isBot = useIsBot()
  const { isDarkMode } = useTernaryDarkMode()

  useEffect(() => {
    const body = document.querySelector("body")

    if (body) {
      isDarkMode ? body.classList.add("dark") : body.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <html lang={locale} dir={i18n.dir()} className="h-full">
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
