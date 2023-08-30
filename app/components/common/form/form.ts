import {
  Form as FrameworkForm,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react"
import { createForm } from "remix-forms"


const Form = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
})

export { Form }
