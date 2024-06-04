import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/fr"

dayjs.locale("fr")

dayjs.extend(localizedFormat)

const date = dayjs

export { date }
