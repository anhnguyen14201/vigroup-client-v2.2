export function getTranslationField(
  pt: any,
  currentLang: string | null,
  field:
    | 'productName'
    | 'metaTitle'
    | 'metaDescription'
    | 'desc'
    | 'name'
    | 'title'
    | 'description'
    | 'buttonText'
    | 'subTitle'
    | 'label'
    | 'noti',
) {
  // Nếu pt.translations không tồn tại hoặc không phải mảng có độ dài > 0, trả về chuỗi rỗng
  if (!Array.isArray(pt?.translations) || pt.translations.length === 0) {
    return ''
  }

  // Tìm translation có trùng code
  const found = pt?.translations.find(
    (t: any) => (t.language as any)?.code === currentLang,
  )
  if (found && typeof found[field] === 'string') {
    return found[field]
  }

  // fallback: lấy bản dịch đầu tiên
  return pt.translations[0][field] || ''
}

export function getTranslationArray(
  pt: any,
  currentLang: string | null,
  arrayField: 'checkList' | 'descriptionParagraphs' | 'steps' | 'philosophy',
) {
  if (!Array.isArray(pt?.translations) || pt.translations.length === 0)
    return []

  // Tìm bản dịch theo ngôn ngữ
  const found = pt.translations.find(
    (t: any) => (t.language?.code || t.language) === currentLang,
  )

  if (found && Array.isArray(found[arrayField])) {
    return found[arrayField]
  }

  // Fallback: Lấy mảng của ngôn ngữ đầu tiên
  return pt.translations[0][arrayField] || []
}

export const getTranslation = (translations: any[], lang: string) => {
  return translations?.find(
    (t: any) => (t.language?.code || t.language) === lang,
  )
}
