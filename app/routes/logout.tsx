import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { logout } from "~/domains/auth/services/session.server"
import { validateCsrf } from "~/utils/csrf.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrf(request)

  return logout(request)
}

export const loader = async () => redirect("/")
