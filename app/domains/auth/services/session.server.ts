import { createCookieSessionStorage, redirect } from "@remix-run/node"
import invariant from "tiny-invariant"

import type { User } from "~/domains/auth/types/user"
import { authenticator } from "./auth.server"

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set")

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
})

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await getSession(request)
  return await authenticator.isAuthenticated(session);
}

export async function requireUser(request: Request, redirectTo: string = "/") {
  const user = await getUser(request)

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw await logout(request, `/login?${searchParams}`)
  }

  return user
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
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}

export async function logout(request: Request, redirectTo: string = "/") {
  const session = await getSession(request)
  
  return redirect(redirectTo, {
    headers: {
    "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
