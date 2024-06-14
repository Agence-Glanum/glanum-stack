import { parseWithZod } from "@conform-to/zod"
import { i18n } from "@lingui/core"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { typedjson } from "remix-typedjson"

import { register } from "~/domains/auth/actions/register.server"
import {
  createUserSession,
  getUser,
} from "~/domains/auth/services/session.server"
import { schema } from "~/domains/auth/validations/sign-up"
import { validateCsrf } from "~/utils/csrf.server"
import { getProperErrorResponse } from "~/utils/error"

import { authenticator } from "../services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  await validateCsrf(request)

  const formData = await request.clone().formData()

  const submission = parseWithZod(formData, { schema: schema(i18n) })

  if (submission.status !== "success") {
    return submission.reply()
  }

  try {
    const { redirectTo, user } = await register({ ...submission.value })

    return createUserSession({
      user,
      request,
      remember: true,
      defaultRedirectTo: redirectTo,
      sessionKey: authenticator.sessionKey,
    })
  } catch (error) {
    return typedjson(getProperErrorResponse(error, { submission }), 400)
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (user) {
    throw redirect("/")
  }

  return typedjson({})
}
