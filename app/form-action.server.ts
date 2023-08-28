import { createFormAction } from 'remix-forms'
// For Remix, import it like this
import { redirect, json } from '@remix-run/node'

const formAction = createFormAction({ redirect, json })

export { formAction }