import { z } from "zod";

export const schema = z.object({
    password: z.string().min(1),
    email: z.string().min(1).email(),
    redirectTo: z.string().nullable(),
    remember: z.enum(["on"]).nullable()
})