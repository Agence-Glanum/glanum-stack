/* eslint-disable */
// @ts-nocheck
import { getInputProps as baseInputProps } from "@conform-to/react"

export function getInputProps(meta, options) {
  const { control, ...baseOptions } = options
  const { defaultValue, key, ...props } = baseInputProps(meta, baseOptions)

  return {
    ...props,
    "aria-invalid": meta.errors ? true : undefined,
    "aria-describedby": meta.errors ? meta.errorId : "",
    ...(control
      ? {
          value: control.value ?? "",
          onChange: (e) => control.change(e.target.value),
        }
      : {
          defaultValue,
        }),
  }
}
