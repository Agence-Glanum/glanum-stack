import { i18n } from "@lingui/core"
import { makeDomainFunction } from "domain-functions"

import { envSchema, schema } from "~/domains/auth/schemas/sign-in"
import { authenticator } from "~/domains/auth/services/auth.server"
import { safeRedirect } from "~/utils"

export const login = makeDomainFunction(
  schema(i18n),
  envSchema,
)(async (values, env) => {
  const user = await authenticator.authenticate("api-proxy", env.request, {
    throwOnError: true,
    context: {
      request: env.request,
    },
  })

  if (!user) {
    throw Error("Server error")
  }

  return {
    redirectTo: safeRedirect(values.redirectTo),
    user,
  }
})
