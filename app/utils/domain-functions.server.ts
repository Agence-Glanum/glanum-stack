import type { Result } from "domain-functions"
import { ResultError } from "domain-functions"

export function propagateError<T>(result: Result<T>) {
  if (!result.success) {
    throw new ResultError(result)
  }

  return result
}
