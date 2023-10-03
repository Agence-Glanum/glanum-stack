import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { User } from "../types/user";
import { ApiProxyStrategy } from "../strategies/api-proxy-strategy.server";
import { attempt } from "../repositories/auth.server";
import { propagateError } from "~/utils/domain-functions.server";

export let authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
    new ApiProxyStrategy(async ({ form }) => {
        const email = form.get('email')
        const password = form.get('password')
        
        const result = propagateError(await attempt({ password, email }))
        
        return result.data 
    }),
    "api-proxy"
  );