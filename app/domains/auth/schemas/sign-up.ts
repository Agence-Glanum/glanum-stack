import { z } from "zod"

export const schema = z.object({
  password: z.string().min(1),
  email: z.string().min(1).email(),
  redirectTo: z.string().nullable(),
})

const Request: z.ZodType<Request> = z.any()

export const envSchema = z.object({
  request: Request
})
