// 都道府県の正規表現パターン
const prefecturePatterns = [
  { name: '北海道', pattern: /^北海道/ },
  { name: '青森県', pattern: /^青森県/ },
  { name: '岩手県', pattern: /^岩手県/ },
  { name: '宮城県', pattern: /^宮城県/ },
  { name: '秋田県', pattern: /^秋田県/ },
  { name: '山形県', pattern: /^山形県/ },
  { name: '福島県', pattern: /^福島県/ },
  { name: '茨城県', pattern: /^茨城県/ },
  { name: '栃木県', pattern: /^栃木県/ },
  { name: '群馬県', pattern: /^群馬県/ },
  { name: '埼玉県', pattern: /^埼玉県/ },
  { name: '千葉県', pattern: /^千葉県/ },
  { name: '東京都', pattern: /^東京都/ },
  { name: '神奈川県', pattern: /^神奈川県/ },
  { name: '新潟県', pattern: /^新潟県/ },
  { name: '富山県', pattern: /^富山県/ },
  { name: '石川県', pattern: /^石川県/ },
  { name: '福井県', pattern: /^福井県/ },
  { name: '山梨県', pattern: /^山梨県/ },
  { name: '長野県', pattern: /^長野県/ },
  { name: '岐阜県', pattern: /^岐阜県/ },
  { name: '静岡県', pattern: /^静岡県/ },
  { name: '愛知県', pattern: /^愛知県/ },
  { name: '三重県', pattern: /^三重県/ },
  { name: '滋賀県', pattern: /^滋賀県/ },
  { name: '京都府', pattern: /^京都府/ },
  { name: '大阪府', pattern: /^大阪府/ },
  { name: '兵庫県', pattern: /^兵庫県/ },
  { name: '奈良県', pattern: /^奈良県/ },
  { name: '和歌山県', pattern: /^和歌山県/ },
  { name: '鳥取県', pattern: /^鳥取県/ },
  { name: '島根県', pattern: /^島根県/ },
  { name: '岡山県', pattern: /^岡山県/ },
  { name: '広島県', pattern: /^広島県/ },
  { name: '山口県', pattern: /^山口県/ },
  { name: '徳島県', pattern: /^徳島県/ },
  { name: '香川県', pattern: /^香川県/ },
  { name: '愛媛県', pattern: /^愛媛県/ },
  { name: '高知県', pattern: /^高知県/ },
  { name: '福岡県', pattern: /^福岡県/ },
  { name: '佐賀県', pattern: /^佐賀県/ },
  { name: '長崎県', pattern: /^長崎県/ },
  { name: '熊本県', pattern: /^熊本県/ },
  { name: '大分県', pattern: /^大分県/ },
  { name: '宮崎県', pattern: /^宮崎県/ },
  { name: '鹿児島県', pattern: /^鹿児島県/ },
  { name: '沖縄県', pattern: /^沖縄県/ }
]

export interface AddressInfo {
  prefecture: string
  city: string
  address: string
}

export function parseAddress(fullAddress: string): AddressInfo | null {
  if (!fullAddress || fullAddress.trim() === '') {
    return null
  }

  const address = fullAddress.trim()

  // 都道府県を検出
  let prefecture = ''
  let remainingAddress = address

  for (const { name, pattern } of prefecturePatterns) {
    if (pattern.test(address)) {
      prefecture = name
      remainingAddress = address.replace(pattern, '').trim()
      break
    }
  }

  if (!prefecture) {
    return null
  }

  // 市区町村を検出（都道府県の後の部分から）
  let city = ''
  
  // 市区町村のパターンを定義
  const cityPatterns = [
    // 市
    /^(.+?市)/,
    // 区（東京都の特別区）
    /^(.+?区)/,
    // 町
    /^(.+?町)/,
    // 村
    /^(.+?村)/
  ]

  for (const pattern of cityPatterns) {
    const match = remainingAddress.match(pattern)
    if (match) {
      city = match[1]
      remainingAddress = remainingAddress.replace(pattern, '').trim()
      break
    }
  }

  // 市区町村が見つからない場合は、残りの住所の最初の部分を使用
  if (!city && remainingAddress) {
    // スペースやカンマで区切られた最初の部分を取得
    const parts = remainingAddress.split(/[\s,、]/)
    city = parts[0] || ''
  }

  return {
    prefecture,
    city,
    address: fullAddress
  }
}

// 住所の妥当性をチェック
export function validateAddress(address: string): { isValid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { isValid: false, error: '住所を入力してください' }
  }

  const parsed = parseAddress(address)
  if (!parsed) {
    return { isValid: false, error: '有効な住所を入力してください' }
  }

  if (!parsed.city) {
    return { isValid: false, error: '市区町村の情報を取得できませんでした' }
  }

  return { isValid: true }
}
