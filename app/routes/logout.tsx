import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { logout } from "~/domains/auth/utils/session.server"

export const action = async ({ request }: ActionFunctionArgs) => logout(request)

export const loader = async () => redirect("/")
