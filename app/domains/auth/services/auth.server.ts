import { Authenticator } from "remix-auth"

import { attempt } from "~/domains/auth/data/auth.server"

import { ApiProxyStrategy } from "../strategies/api-proxy-strategy.server"
import { User } from "../types/user"

import { sessionStorage } from "./init.server"

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new ApiProxyStrategy(async ({ form }) => {
    const email = (form.get("email") as string) ?? ""
    const password = (form.get("password") as string) ?? ""

    return await attempt({ password, email })
  }),
  "api-proxy",
)
