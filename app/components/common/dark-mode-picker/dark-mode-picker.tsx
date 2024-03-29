/* eslint react-hooks/rules-of-hooks: 0 */

import { MonitorDot, Moon, Sun } from "lucide-react"

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
    useTernaryDarkModeOutput ??
    useTernaryDarkMode({ initializeWithValue: false, defaultValue: "system" })

  type TernaryDarkMode = typeof ternaryDarkMode

  const onChange = (value: string) => {
    setTernaryDarkMode(value as TernaryDarkMode)
  }

  return (
    <ToggleGroup type="single" value={ternaryDarkMode} onValueChange={onChange}>
      <ToggleGroupItem value="dark">
        <Moon className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <MonitorDot className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light">
        <Sun className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
