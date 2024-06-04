import { ResultError } from "domain-functions"
import { HTTPError } from "ky"

import i18next from "~/i18next.server"

export const getProperError = async (error: unknown, request: Request) => {
  if (error instanceof ResultError) {
    return error.message
  }

  if (Array.isArray(error)) {
    if (error[0].exception instanceof Error) {
      return error[0].message
    }

    return error[0].exception
  }

  const t = await i18next.getFixedT(request)
  return t("Unexpected error")
}

export const getHttpError = async (
  error: unknown,
  request: Request,
  defaultError: unknown = undefined,
) => {
  console.log(error)
  if (error instanceof HTTPError) {
    if (error.response.status === 422) {
      const body = await error.response.json()

      const errors: Record<string, string> = {}
      for (const [key, value] of Object.entries<string[]>(body.errors)) {
        errors[key] = value[0]
      }

      return errors
    }

    const t = await i18next.getFixedT(request)
    return Error(t("Unexpected error"))
  }

  return defaultError ?? error
}
