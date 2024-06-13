import { Trans } from "@lingui/macro"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"
import { useState } from "react"

import { Button } from "~/components/common/ui/button"
import { Input, InputProps } from "~/components/common/ui/input"

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ tabIndex, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          type={showPassword ? "text" : "password"}
          tabIndex={tabIndex}
        />
        <Button
          variant="ghost"
          size="icon"
          type="button"
          tabIndex={tabIndex ? tabIndex + 1 : undefined}
          onClick={handleClickShowPassword}
          className="h-7 w-7 absolute right right-1 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="sr-only">
                <Trans>Hide password</Trans>
              </span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="sr-only">
                <Trans>Show password</Trans>
              </span>
            </>
          )}
        </Button>
      </div>
    )
  },
)

InputPassword.displayName = "InputPassword"

export default InputPassword
