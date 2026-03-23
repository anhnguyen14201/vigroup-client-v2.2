import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Lấy locale từ request (thường là từ segment `[locale]`)
  let locale = await requestLocale

  // Nếu không có locale hoặc locale không hợp lệ, sử dụng defaultLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale || 'vi'
  }

  let messages
  try {
    // Cố gắng import file JSON tương ứng với locale
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch {
    // Nếu không tìm thấy file cho locale, chuyển sang dùng file của defaultLocale
    messages = (
      await import(`../../messages/${routing.defaultLocale || 'vi'}.json`)
    ).default
    // Đồng thời, bạn có thể gán lại locale cho defaultLocale nếu cần:
    locale = routing.defaultLocale || 'vi'
  }

  return {
    locale,
    messages,
  }
})
