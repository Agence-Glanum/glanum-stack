import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"

z.setErrorMap(zodI18nMap)

export const schema = z.object({
  password: z.string().min(1),
  email: z.string().min(1).email(),
  redirectTo: z.string().optional(),
})

const Request: z.ZodType<Request> = z.any()

export const envSchema = z.object({
  request: Request,
})
