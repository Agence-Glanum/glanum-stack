import { Authenticator } from "remix-auth";
import { sessionStorage } from "./init.server";
import { User } from "../types/user";
import { ApiProxyStrategy } from "../strategies/api-proxy-strategy.server";
import { attempt } from "../repositories/auth.server";
import { propagateError } from "~/utils/domain-functions.server";

export let authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
    new ApiProxyStrategy(async ({ form, context }) => {
        const email = form.get('email')
        const password = form.get('password')
        
        const result = propagateError(await attempt({ password, email }, { request: context?.request }))
        
        return result.data 
    }),
    "api-proxy"
  );