import { t, Trans } from "@lingui/macro"
import type { MetaFunction } from "@remix-run/node"

import SignUpForm from "~/components/auth/sign-up/sign-up-form/sign-up-form"
import DarkModePickerPopover from "~/components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover"
import { action, loader } from "~/domains/auth/controllers/sign-up.server"

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.title ?? t`Sign up` },
]

export { loader, action }

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md  py-4 px-8 rounded-xl border bg-card text-card-foreground shadow">
        <div className="absolute top-[15px] right-[15px]">
          <DarkModePickerPopover />
        </div>
        <h1 className="w-full text-center text-2xl font-bold">
          <Trans>Sign up</Trans>
        </h1>
        <SignUpForm />
      </div>
    </div>
  )
}
