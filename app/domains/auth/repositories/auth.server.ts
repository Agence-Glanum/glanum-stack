import { makeDomainFunction } from "domain-functions"
import { z } from "zod"
import { User } from "../types/user"

export const attempt = makeDomainFunction(
  z.object({
    password: z.string().min(1),
    email: z.string().min(1),
  }),
)(async ({}): Promise<User> => {
  // Access data source for the correct value
  const authAttempt = { id: "azc", name: "Zac", token: "caz" }

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
  const register = { id: "", name: "", token: "" }

  if (!register) {
    throw new Error()
  }

  return {
    token: register.token,
    user: { ...register },
  }
})
