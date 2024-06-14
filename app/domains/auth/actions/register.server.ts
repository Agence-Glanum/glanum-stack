import { createAccount } from "~/domains/auth/data/auth.server"
import { safeRedirect } from "~/utils"

interface RegisterParams {
  email: string
  password: string
  redirectTo?: string | undefined
}

export async function register({
  password,
  email,
  redirectTo = undefined,
}: RegisterParams) {
  const user = await createAccount({ password, email })

  return {
    user,
    redirectTo: safeRedirect(redirectTo ?? "/"),
  }
}
