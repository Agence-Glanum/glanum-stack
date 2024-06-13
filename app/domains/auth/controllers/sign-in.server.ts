import { parseWithZod } from "@conform-to/zod"
import { i18n } from "@lingui/core"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { typedjson } from "remix-typedjson"

import { login } from "~/domains/auth/actions/login.server"
import { schema } from "~/domains/auth/schemas/sign-in"
import {
  createUserSession,
  getUser,
} from "~/domains/auth/services/session.server"
import { validateCsrf } from "~/utils/csrf.server"
import { getProperError } from "~/utils/error"

import { authenticator } from "../services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  await validateCsrf(request)

  const formData = await request.clone().formData()

  const submission = parseWithZod(formData, { schema: schema(i18n) })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const result = await login({ ...submission.payload }, { request })

  if (!result.success) {
    return typedjson(
      {
        ...submission.reply({
          formErrors: [(await getProperError(result)).error],
        }),
      },
      400,
    )
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: true,
    sessionKey: authenticator.sessionKey,
    request,
    user: result.data.user,
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (user) {
    throw redirect("/")
  }

  return typedjson({})
}
