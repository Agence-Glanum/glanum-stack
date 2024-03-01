import { makeDomainFunction } from "domain-functions"
import { z } from "zod"

import { User } from "../types/user"

const exampleUser = {
  id: "aefa6970-663e-4efc-b11f-574edb16ea94",
  name: "Glanum",
  token: "a7e90f2e-9176-439e-b821-ead4e6bbfacb",
}

export const attempt = makeDomainFunction(
  z.object({
    password: z.string().min(1),
    email: z.string().min(1),
  }),
)(async (): Promise<User> => {
  // Access data source for the correct value
  const authAttempt = exampleUser

  if (!authAttempt) {
    throw new Error("Email or password are incorrect")
  }

  return authAttempt
})

export const createAccount = makeDomainFunction(
  z.object({
    password: z.string().min(1),
    email: z.string().min(1),
  }),
)(async () => {
  // Access data source for the correct value
  const register = exampleUser

  if (!register) {
    throw new Error()
  }

  return register
})
