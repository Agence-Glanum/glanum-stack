import { createCookie, json } from "@remix-run/node" // or cloudflare/deno
import { CSRF, CSRFError } from "remix-utils/csrf/server"

export const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: ["changetokeninproduction"],
})

export const csrf = new CSRF({
  cookie,
  // what key in FormData objects will be used for the token, defaults to `csrf`
  formDataKey: "csrf",
  // an optional secret used to sign the token, recommended for extra safety
  secret: "changetokeninproduction",
})

export const validateCsrf = async (request: Request) => {
  try {
    await csrf.validate(request)
  } catch (error) {
    if (error instanceof CSRFError) {
      throw json(`Csrf error ${error.message}`, { status: 419 })
    }

    throw json("Server error", { status: 500 })
  }
}
