import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import type { MetaFunction } from "@remix-run/node"
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import DarkModePickerPopover from "~/components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover"
import Errors from "~/components/common/form/errors/errors"
import { Button } from "~/components/common/ui/button"
import { Input } from "~/components/common/ui/input"
import { Label } from "~/components/common/ui/label"
import { action, loader } from "~/domains/auth/controllers/sign-in.server"
import { schema } from "~/domains/auth/schemas/sign-in"

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.title },
]

export { loader, action }

export default function SignInPage() {
  const lastResult = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const redirectTo = searchParams.get("redirectTo") ?? undefined

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div className="absolute top-[15px] right-[15px]">
        <DarkModePickerPopover />
      </div>
      <div className="mx-auto w-full max-w-md py-4 px-8 rounded-xl border bg-card text-card-foreground shadow">
        <h1 className="w-full text-center text-2xl font-bold">
          {t("Sign in")}
        </h1>
        <Form method="post" className="space-y-6" {...getFormProps(form)}>
          <AuthenticityTokenInput />

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <Label htmlFor={fields.email.id}>{t("Email address")}</Label>
            <div className="mt-1">
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                required
              />
              {fields.email.errors ? (
                <div
                  className="text-sm font-semibold text-destructive"
                  id={fields.email.errorId}
                >
                  {fields.email.errors}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.password.id}>{t("Password")}</Label>
            <div className="mt-1">
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                required
              />
              {fields.password.errors ? (
                <div
                  className="text-sm font-semibold text-destructive"
                  id={fields.password.errorId}
                >
                  {fields.password.errors}
                </div>
              ) : null}
            </div>
          </div>

          {form.errors ? (
            <Errors>{form.errors.map((error) => error)}</Errors>
          ) : null}

          <Button type="submit" className="w-full">
            {t("Sign in")}
          </Button>

          <div className="w-full text-center text-sm text-gray-500">
            {t("Don't have an account?")}{" "}
            <Button className="px-0" variant="link" asChild>
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
        </Form>
      </div>
    </div>
  )
}
