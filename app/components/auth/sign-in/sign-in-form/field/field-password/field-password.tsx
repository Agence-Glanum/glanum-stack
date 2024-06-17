import { FieldName, useField, useInputControl } from "@conform-to/react"
import { Trans } from "@lingui/macro"
import { z } from "zod"

import ErrorsField from "~/components/common/form/errors/errors-field/errors-field"
import InputPassword from "~/components/common/form/input-password/input-password"
import { Label } from "~/components/common/ui/label"
import { schema } from "~/domains/auth/validations/sign-in"
import { getInputProps } from "~/utils/form"

export default function FieldPassword({
  name,
}: {
  name: FieldName<string | null, z.infer<ReturnType<typeof schema>>>
}) {
  const [meta] = useField(name)
  const control = useInputControl(meta)

  return (
    <div>
      <Label htmlFor={meta.id}>
        <Trans>Password</Trans>
      </Label>
      <InputPassword
        {...getInputProps(meta, { type: "password", control })}
        required
        className="mt-1"
      />
      <ErrorsField id={meta.errorId} errors={meta.errors} />
    </div>
  )
}
