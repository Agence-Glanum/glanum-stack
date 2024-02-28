import type { MetaFunction } from "@remix-run/node"
import { Link, useSearchParams } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { Form } from "~/components/common/form/form"
import { Button } from "~/components/common/ui/button"
import { action, loader } from "~/domains/auth/controllers/sign-in.server"
import { schema } from "~/domains/auth/schemas/sign-in"

export const meta: MetaFunction = () => [{ title: "Login" }]

export { loader, action }

export default function SignInPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  const { t } = useTranslation()

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
                      {t("Email address")}
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
                      {t("Password")}
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

              <Button
                 type="submit"
                 className="w-full"
              >
                {t("Log in")}
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register("remember")}
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {t("Remember me")}
                  </label>
                </div>
                <div className="text-center text-sm text-gray-500">
                {t("Don't have an account?")}{" "}
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link
                      to={{
                        pathname: "/sign-up",
                        search: searchParams.toString(),
                      }}
                    >
                      {t("Sign up")}
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
