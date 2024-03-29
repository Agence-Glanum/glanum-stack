import { MonitorDot, Moon, Sun } from "lucide-react"
import { useState } from "react"

import DarkModePicker from "~/components/common/dark-mode-picker/dark-mode-picker"
import { Button } from "~/components/common/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/common/ui/popover"
import { useTernaryDarkMode } from "~/hooks/use-ternary-dark-mode"

export default function DarkModePickerPopover() {
  const [open, setOpen] = useState(false)

  const ternaryProps = useTernaryDarkMode({
    initializeWithValue: false,
    defaultValue: "system",
  })

  const { ternaryDarkMode } = ternaryProps

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={open ? "secondary" : "ghost"}>
          <span className="sr-only">{ternaryDarkMode}</span>
          {ternaryDarkMode === "dark" ? <Moon className="w-4 h-4" /> : null}
          {ternaryDarkMode === "light" ? <Sun className="w-4 h-4" /> : null}
          {ternaryDarkMode === "system" ? (
            <MonitorDot className="w-4 h-4" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1">
        <DarkModePicker useTernaryDarkModeOutput={ternaryProps} />
      </PopoverContent>
    </Popover>
  )
}
