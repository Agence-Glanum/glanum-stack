import { FieldName, useField, useInputControl } from "@conform-to/react"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import ErrorsField from "~/components/common/form/errors/errors-field/errors-field"
import { Input } from "~/components/common/ui/input"
import { Label } from "~/components/common/ui/label"
import { schema } from "~/domains/auth/schemas/sign-in"
import { getInputProps } from "~/utils/form"

export default function FieldEmail({
  name,
}: {
  name: FieldName<string | null, z.infer<typeof schema>>
}) {
  const [meta] = useField(name)
  const control = useInputControl(meta)

  const { t } = useTranslation()

  return (
    <div>
      <Label htmlFor={meta.id}>{t("Email address")}</Label>
      <Input
        {...getInputProps(meta, { type: "email", control })}
        required
        className="mt-1"
      />
      <ErrorsField id={meta.errorId} errors={meta.errors} />
    </div>
  )
}
