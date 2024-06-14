import { Submission } from "@conform-to/dom"
import { t } from "@lingui/macro"
import { HTTPError } from "ky"

interface ErrorContext {
  submission?: Submission<unknown>
}

export function getProperErrorResponse(
  error: unknown,
  { submission }: ErrorContext,
) {
  console.log(error)

  if (error instanceof Error) {
    if (submission) {
      return submission.reply({
        formErrors: [error.message],
      })
    }

    return { error: error.message }
  }

  return { error: t`Unexpected error` }
}

export const getHttpError = async (
  error: unknown,
  request: Request,
  defaultError: unknown = undefined,
) => {
  if (error instanceof HTTPError) {
    if (error.response.status === 422) {
      const body = await error.response.json()

      const errors: Record<string, string> = {}
      for (const [key, value] of Object.entries<string[]>(body.errors)) {
        errors[key] = value[0]
      }

      return errors
    }
    return Error(t`Unexpected error`)
  }

  return defaultError ?? error
}
