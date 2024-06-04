import ky, { KyResponse, Options } from "ky"

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}
const api = ky.create({ prefixUrl: process.env.API_URL, headers })

interface OptionsType extends Options {
  token?: string
}
type ResponseType = KyResponse

const transformOptions = (options: OptionsType | undefined) => {
  if (!options) {
    return undefined
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${options.token}`,
    },
  }
}

export async function get(
  route: string,
  options?: OptionsType,
): Promise<ResponseType> {
  return api.get(route, transformOptions(options))
}
export async function post(
  route: string,
  options?: OptionsType,
): Promise<ResponseType> {
  return api.post(route, transformOptions(options))
}
export async function put(
  route: string,
  options?: OptionsType,
): Promise<ResponseType> {
  return api.put(route, transformOptions(options))
}
export async function patch(
  route: string,
  options?: OptionsType,
): Promise<ResponseType> {
  return api.patch(route, transformOptions(options))
}
export async function head(
  route: string,
  options?: OptionsType,
): Promise<ResponseType> {
  return api.head(route, transformOptions(options))
}
// export async function delete(route: string, options?: OptionsType): Promise<boolean>{
//     return await ky.delete(route, options)
// }
