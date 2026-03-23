export function formatPhone(input: string): string {
  if (/[a-zA-Z]/.test(input)) {
    return input // giữ nguyên nếu chứa chữ cái :contentReference[oaicite:0]{index=0}
  }

  // 2. Giữ dấu '+' nếu có, xóa mọi ký tự không phải chữ số
  const hasPlus = input.startsWith('+')
  const digits = input.replace(/\D/g, '') // \D = non-digit :contentReference[oaicite:1]{index=1}

  // 3. Tách thành nhóm: 1–3 chữ số đầu (mã quốc gia), tiếp 3-3, phần còn lại
  const match = digits.match(/^(\d{1,3})(\d{3})(\d{3})(\d*)$/)

  if (!match) {
    // Fallback: chia nhóm 3 từ cuối
    const fallback = digits.replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
    return hasPlus ? `+${fallback}` : fallback
  }

  const [, country, g1, g2, rest] = match
  const groups = [country, g1, g2]
  if (rest) groups.push(rest)
  return (hasPlus ? '+' : '') + groups.join(' ')
}
