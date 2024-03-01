import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/components/common/ui/toggle-group"
import {
  TernaryDarkModeResult,
  useTernaryDarkMode,
} from "~/hooks/use-ternary-dark-mode"

interface DarkModePickerProps {
  useTernaryDarkModeOutput?: TernaryDarkModeResult
}

export default function DarkModePicker({
  useTernaryDarkModeOutput,
}: DarkModePickerProps) {
  const { ternaryDarkMode, setTernaryDarkMode } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTernaryDarkModeOutput ?? useTernaryDarkMode({initializeWithValue: false, defaultValue: "system"})

  type TernaryDarkMode = typeof ternaryDarkMode

  const onChange = (value: string) => {
    setTernaryDarkMode(value as TernaryDarkMode)
  }

  return (
    <ToggleGroup type="single" value={ternaryDarkMode} onValueChange={onChange}>
      <ToggleGroupItem value="dark">
        <MoonIcon className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <DesktopIcon className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light">
        <SunIcon className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
