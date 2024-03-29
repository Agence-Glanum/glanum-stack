import { TriangleAlert } from "lucide-react"

import { Alert, AlertTitle } from "~/components/common/ui/alert"
import { cn } from "~/utils/cn"

export default function Errors({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Alert
      variant="destructive"
      className={cn(
        "flex items-center bg-destructive/5 border-none [&>svg+div]:translate-y-0 [&>svg]:relative [&>svg]:left-0 [&>svg]:top-0 [&>svg~*]:pl-2",
        className,
      )}
      {...props}
    >
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>{children}</AlertTitle>
    </Alert>
  )
}
