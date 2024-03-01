import { redirect, Session } from "@remix-run/node"

import type { User } from "~/domains/auth/types/user"

import { authenticator } from "./auth.server"
import { sessionStorage } from "./init.server"

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await getSession(request)
  return await authenticator.isAuthenticated(session)
}

export async function flashMessage(
  request: Request,
  key: string,
  message: string,
) {
  const session = await getSession(request)
  session.flash(key, message)
  return await sessionStorage.commitSession(session)
}

export async function getFlashMessage(request: Request, key: string) {
  const session = await getSession(request)
  return [session.get(key), session]
}

export async function requireUser(
  request: Request,
  redirectTo: string | null = null,
) {
  const user = await getUser(request)

  if (!user) {
    let to = "/"

    if (!redirectTo) {
      const url = new URL(request.url)
      to = url.pathname
    }

    const searchParams = new URLSearchParams([["redirectTo", to]])
    throw await logout(request, `/login?${searchParams}`)
  }

  return user
}

export async function commitCookie({
  session,
  remember = true,
}: {
  session: Session
  remember?: boolean
}) {
  return await sessionStorage.commitSession(session, {
    maxAge: remember
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined,
  })
}

export async function createUserSession({
  request,
  user,
  sessionKey,
  remember,
  defaultRedirectTo,
}: {
  request: Request
  user: User
  sessionKey: string
  remember: boolean
  defaultRedirectTo: string
}) {
  const session = await getSession(request)

  session.set(sessionKey, user)

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirectTo") ?? defaultRedirectTo

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitCookie({ session, remember }),
    },
  })
}

export async function updateUserSession({
  request,
  sessionKey,
  user,
}: {
  request: Request
  sessionKey: string
  user: User
}) {
  const session = await getSession(request)

  session.set(sessionKey, user)

  return {
    "Set-Cookie": await commitCookie({ session }),
  }
}

export async function logout(request: Request, redirectTo = "/") {
  const session = await getSession(request)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  })
}
