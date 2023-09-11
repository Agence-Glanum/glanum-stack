import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { InputError, makeDomainFunction } from "domain-functions"
import { performMutation } from "remix-forms"

import { checkIfEmailExists } from "~/domains/auth/repositories/user.server"
import { schema } from "~/domains/auth/schemas/sign-up"
import { createUserSession, getUser } from "~/domains/auth/utils/session.server"
import { safeRedirect } from "~/utils"
import { propagateError } from "~/utils/domain-functions.server"

import { createAccount } from "../repositories/auth.server"

const register = makeDomainFunction(schema)(async (values) => {
  const checkIfEmailExistsResult = await checkIfEmailExists({
    email: values.email,
  })

  if (!checkIfEmailExistsResult.success) {
    throw new InputError("Email aldready exists", "email")
  }

  const createAccountResult = propagateError(
    await createAccount({ password: values.password, email: values.email }),
  )

  return {
    redirectTo: safeRedirect(values.redirectTo),
    user: { ...createAccountResult.data.user },
  }
})

export async function action({ request }: ActionArgs) {
  const result = await performMutation({ request, mutation: register, schema })

  if (!result.success) {
    return json(result, 400)
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: false,
    request,
    user: result.data.user,
  })
}

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request)
  if (user) {
    return redirect("/")
  }
  return json({})
}
