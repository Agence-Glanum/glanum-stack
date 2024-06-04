import { makeDomainFunction } from "domain-functions"

import { createAccount } from "~/domains/auth/repositories/auth.server"
import { schema } from "~/domains/auth/schemas/sign-up"
import { safeRedirect } from "~/utils"
import { propagateError } from "~/utils/domain-functions.server"

export const register = makeDomainFunction(schema)(async ({
  password,
  email,
  redirectTo,
}) => {
  const result = propagateError(await createAccount({ password, email }))

  return {
    redirectTo: safeRedirect(redirectTo ?? "/"),
    user: { ...result.data },
  }
})
