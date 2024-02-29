import type { ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { makeDomainFunction } from "domain-functions"

import { schema } from "~/domains/auth/schemas/sign-up"
import { createUserSession, getUser } from "~/domains/auth/services/session.server"
import { safeRedirect } from "~/utils"
import { propagateError } from "~/utils/domain-functions.server"

import { createAccount } from "../repositories/auth.server"
import { authenticator } from "../services/auth.server";
import i18next from "~/i18next.server";
import { validateCsrf } from "~/utils/csrf.server";
import { parseWithZod } from "@conform-to/zod";
import { typedjson } from "remix-typedjson";
import { getProperError } from "~/utils/error";

const register = makeDomainFunction(schema)(async ({password, email, redirectTo}) => {
  const result = propagateError(
    await createAccount({ password, email }),
  )

  return {
    redirectTo: safeRedirect(redirectTo ?? "/"),
    user: { ...result.data },
  }
})

export async function action({ request }: ActionFunctionArgs) {
  await validateCsrf(request)

  const formData = await request.clone().formData()

  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const result = await register({ ...submission.payload }, { request })

  if (!result.success) {
    return typedjson({
      ...submission.reply({
        formErrors: [(await getProperError(result, request)).error]
      })
    }, 400)
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: false,
    sessionKey: authenticator.sessionKey,
    request,
    user: result.data.user,
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (user) {
    return redirect("/")
  }
  
  const t = await i18next.getFixedT(request)
  const title = t("Sign up")

  return json({title})
}
