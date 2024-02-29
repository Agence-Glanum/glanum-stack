import { useTypedRouteLoaderData } from "remix-typedjson"

import type { User } from "./domains/auth/types/user"
import { loader } from "./root"

const DEFAULT_REDIRECT = "/"

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect
  }

  return to
}

function isUser(user: null | undefined | object): user is User {
  return (
    user !== null &&
    user !== undefined &&
    typeof user === "object" &&
    "token" in user &&
    typeof user["token"] === "string"
  )
}

export function useOptionalUser(): User | undefined {
  const data = useTypedRouteLoaderData<typeof loader>("root")
  if (!data || !isUser(data.user)) {
    return undefined
  }

  return data.user
}

export function useUser(): User {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    )
  }
  return maybeUser
}
