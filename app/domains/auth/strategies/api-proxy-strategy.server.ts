import { AppLoadContext, SessionStorage } from "@remix-run/server-runtime"
import { AuthenticateOptions, Strategy } from "remix-auth"

export interface ApiProxyStrategyVerifyParams {
  form: FormData
  context?: AppLoadContext
}

export class ApiProxyStrategy<User> extends Strategy<
  User,
  ApiProxyStrategyVerifyParams
> {
  name = "api-proxy"

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions,
  ): Promise<User> {
    const form = await this.readFormData(request, options)

    try {
      const user = await this.verify({ form, context: options.context })
      return this.success(user, request, sessionStorage, options)
    } catch (error) {
      if (error instanceof Error) {
        return await this.failure(
          error.message,
          request,
          sessionStorage,
          options,
          error,
        )
      }

      if (typeof error === "string") {
        return await this.failure(
          error,
          request,
          sessionStorage,
          options,
          new Error(error),
        )
      }

      return await this.failure(
        "Unknown error",
        request,
        sessionStorage,
        options,
        new Error(JSON.stringify(error, null, 2)),
      )
    }
  }

  private async readFormData(request: Request, options: AuthenticateOptions) {
    if (options.context?.formData instanceof FormData) {
      return options.context.formData
    }

    return await request.formData()
  }
}
