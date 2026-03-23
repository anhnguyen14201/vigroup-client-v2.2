export function formatDateTimeCzech(utcString: any) {
  if (!utcString) return ''
  const date = new Date(utcString)
  if (isNaN(date.getTime())) return ''

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Prague',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

  const datePart = new Intl.DateTimeFormat('cs-CZ', dateOptions).format(date)
  const timePart = new Intl.DateTimeFormat('cs-CZ', timeOptions).format(date)

  return ` ${timePart} | ${datePart}`
}

export function formatDateCzech(utcString: any) {
  if (!utcString) return ''
  const date = new Date(utcString)
  if (isNaN(date.getTime())) return ''

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Prague',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  // Sử dụng 'cs-CZ' để có định dạng ngày của Séc (thường là dd.mm.yyyy)
  return new Intl.DateTimeFormat('cs-CZ', dateOptions).format(date)
}

export function formatTimeCzech(utcString: any, includeSeconds = false) {
  if (!utcString) return ''
  const date = new Date(utcString)
  if (isNaN(date.getTime())) return ''

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  }

  // Kết quả sẽ có dạng "14:30" (hoặc "14:30:05" nếu includeSeconds = true)
  return new Intl.DateTimeFormat('cs-CZ', timeOptions).format(date)
}
