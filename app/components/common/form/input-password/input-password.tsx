import { Eye, EyeOff } from "lucide-react"
import PropTypes from "prop-types"
import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/components/common/ui/button"
import { Input, InputProps } from "~/components/common/ui/input"

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ tabIndex, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const { t } = useTranslation()

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
          tabIndex={tabIndex ? tabIndex + 1 : undefined}
          onClick={handleClickShowPassword}
          className="h-7 w-7 absolute right right-1 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="sr-only">{t("Hide password")}</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="sr-only">{t("Show password")}</span>
            </>
          )}
        </Button>
      </div>
    )
  },
)

InputPassword.propTypes = {
  className: PropTypes.string,
  tabIndex: PropTypes.number,
}

InputPassword.displayName = "InputPassword"

export default InputPassword
