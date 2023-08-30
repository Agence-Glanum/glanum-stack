import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { makeDomainFunction } from "domain-functions"
import { performMutation } from "remix-forms"

import { attempt } from "~/domains/auth/repositories/auth.server"
import { schema } from "~/domains/auth/schemas/sign-in"
import { createUserSession, getUser } from "~/domains/auth/utils/session.server"
import { safeRedirect } from "~/utils"
import { propagateError } from "~/utils/domain-functions"

const login = makeDomainFunction(schema)(async (values) => {
  const auth = propagateError(
    await attempt({ password: values.password, email: values.email }),
  )

  return {
    redirectTo: safeRedirect(values.redirectTo),
    remember: "on" ? true : false,
    user: { ...auth.data.user },
  }
})

export async function action({ request }: ActionArgs) {
  const result = await performMutation({ request, mutation: login, schema })

  if (!result.success) {
    return json(result, 400)
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: result.data.remember,
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
