import { useTypedRouteLoaderData } from "remix-typedjson"

import type { User } from "~/domains/auth/types/user"
import { loader } from "~/root"

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
