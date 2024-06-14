import { t } from "@lingui/macro"

import { User } from "../types/user"

const exampleUser = {
  id: "aefa6970-663e-4efc-b11f-574edb16ea94",
  name: "Glanum",
  token: "a7e90f2e-9176-439e-b821-ead4e6bbfacb",
}

interface AttemptParams {
  email: string
  password: string
}

export async function attempt({ email }: AttemptParams): Promise<User> {
  const authAttempt = { ...exampleUser, email }

  if (!authAttempt) {
    throw new Error(t`Email or password are incorrect`)
  }

  return authAttempt
}

interface CreateAccountParams {
  email: string
  password: string
}

export async function createAccount({
  email,
}: CreateAccountParams): Promise<User> {
  const register = { ...exampleUser, email }

  if (!register) {
    throw new Error(t`The account could not be created`)
  }

  return register
}
