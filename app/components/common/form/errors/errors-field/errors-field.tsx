interface ErrorsFieldProps {
  id: string
  errors: string[] | undefined
}

export default function ErrorsField({ id, errors }: ErrorsFieldProps) {
  if (!errors) {
    return null
  }

  return (
    <div className="text-sm font-semibold text-destructive" id={id}>
      {errors}
    </div>
  )
}
