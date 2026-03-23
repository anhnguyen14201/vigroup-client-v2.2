export function decodeJwt(token?: string | null) {
  if (!token) return null
  const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token
  try {
    const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  } catch (e) {
    return null
  }
}
