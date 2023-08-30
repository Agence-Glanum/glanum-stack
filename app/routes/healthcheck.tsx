export const loader = async () => {
  try {
    return new Response("OK")
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error })
    return new Response("ERROR", { status: 500 })
  }
}
