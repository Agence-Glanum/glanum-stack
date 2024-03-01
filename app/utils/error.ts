import { ResultError } from "domain-functions"

import i18next from "~/i18next.server"

export const getProperError = async (error: unknown, request: Request) => {
  if (error instanceof ResultError) {
    return {
      error: error.message,
    }
  }

  const t = await i18next.getFixedT(request)
  return { error: t("Unexpected error") }
}
