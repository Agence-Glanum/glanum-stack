import type { MetaFunction } from "@remix-run/node"
import { Link, useSearchParams } from "@remix-run/react"

import { Form } from "~/components/common/form/form"
import { action, loader } from "~/domains/auth/controllers/sign-up.server"
import { schema } from "~/domains/auth/schemas/sign-up"

export const meta: MetaFunction = () => [{ title: "Sign Up" }]

export { loader, action }

export default function SignUpPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? undefined

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form schema={schema} method="post" className="space-y-6">
          {({ Field, Errors, register }) => (
            <>
              <Field name="email">
                {({ Errors, errors }) => (
                  <>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("email")}
                        id="email"
                        required
                        autoFocus={true}
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors ? true : undefined}
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                      />
                      <Errors className="pt-1 text-red-700" id="email-error" />
                    </div>
                  </>
                )}
              </Field>

              <Field name="password">
                {({ Errors, errors }) => (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("password")}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={errors ? true : undefined}
                        aria-describedby="password-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                      />
                      <Errors className="pt-1 text-red-700" id="email-error" />
                    </div>
                  </>
                )}
              </Field>

              <input type="hidden" name="redirectTo" value={redirectTo} />

              <Errors />

              <input type="hidden" name="redirectTo" value={redirectTo} />
              <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Create Account
              </button>
              <div className="flex items-center justify-center">
                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    className="text-blue-500 underline"
                    to={{
                      pathname: "/sign-in",
                      search: searchParams.toString(),
                    }}
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
