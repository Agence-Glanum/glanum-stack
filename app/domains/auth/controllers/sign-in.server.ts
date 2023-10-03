import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { makeDomainFunction } from "domain-functions"
import { performMutation } from "remix-forms"

import { envSchema, schema } from "~/domains/auth/schemas/sign-in"
import { createUserSession, getUser } from "~/domains/auth/services/session.server"
import { safeRedirect } from "~/utils"
import { authenticator } from "../services/auth.server";

const login = makeDomainFunction(schema, envSchema)(async (values, env) => {
  const user = await authenticator.authenticate("api-proxy", env.request)

  return {
    redirectTo: safeRedirect(values.redirectTo),
    remember: "on" ? true : false,
    user: { ...user },
  }
})

export async function action({ request }: ActionFunctionArgs) {
  const result = await performMutation({
    request,
    mutation: login,
    schema,
    environment: { request }
  })

  if (!result.success) {
    return json(result, 400)
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: result.data.remember,
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
  return json({})
}
