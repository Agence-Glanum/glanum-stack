import { FormProvider, getFormProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { i18n } from "@lingui/core"
import { Trans } from "@lingui/macro"
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import FieldEmail from "~/components/auth/sign-up/sign-up-form/field/field-email/field-email"
import FieldPassword from "~/components/auth/sign-up/sign-up-form/field/field-password/field-password"
import Errors from "~/components/common/form/errors/errors"
import { Button } from "~/components/common/ui/button"
import { schema } from "~/domains/auth/validations/sign-up"
import { action } from "~/routes/sign-up"
import { getInputProps } from "~/utils/form"

export default function SignUpForm() {
  const lastResult = useActionData<typeof action>()

  const [searchParams] = useSearchParams()

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onSubmit",
    defaultValue: {
      email: "",
      password: "",
      redirectTo: searchParams.get("redirectTo") ?? undefined,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema(i18n) })
    },
  })

  const navigation = useNavigation()

  const isSubmitting =
    navigation.state === "submitting" ||
    (navigation.state === "loading" && navigation.formMethod === "POST")

  return (
    <Form method="post" className="space-y-6" {...getFormProps(form)}>
      <FormProvider context={form.context}>
        <AuthenticityTokenInput />

        <input {...getInputProps(fields.redirectTo, { type: "hidden" })} />

        <FieldEmail name={fields.email.name} />

        <FieldPassword name={fields.password.name} />

        {form.errors ? (
          <Errors>{form.errors.map((error) => error)}</Errors>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Trans>Sign up</Trans>
          {isSubmitting ? "..." : ""}
        </Button>

        <div className="w-full text-center text-sm text-gray-500">
          <Trans>Already have an account?</Trans>{" "}
          <Button className="px-0" variant="link" asChild>
            <Link
              to={{
                pathname: "/sign-in",
                search: searchParams.toString(),
              }}
            >
              <Trans>Sign in</Trans>
            </Link>
          </Button>
        </div>
      </FormProvider>
    </Form>
  )
}
