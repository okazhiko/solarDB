'use client'

import { useState } from 'react'
import { CreatePowerPlantData } from '@/lib/supabase'

interface PowerPlantFormProps {
  onSubmit: (data: CreatePowerPlantData) => void
  onCancel: () => void
}

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

const categories = [
  '住宅用太陽光発電',
  '産業用太陽光発電',
  'メガソーラー',
  '風力発電',
  '水力発電',
  '地熱発電',
  'バイオマス発電',
  'その他'
]

export default function PowerPlantForm({ onSubmit, onCancel }: PowerPlantFormProps) {
  const [formData, setFormData] = useState<CreatePowerPlantData>({
    plant_name: '',
    plant_address: '',
    prefecture: '',
    city: '',
    owner: '',
    dc_capacity: 0,
    ac_capacity: 0,
    operation_start_date: '',
    category: 'その他'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dc_capacity' || name === 'ac_capacity' ? parseFloat(value) || 0 : value
    }))
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.plant_name.trim()) {
      newErrors.plant_name = '発電所名は必須です'
    }

    if (!formData.plant_address.trim()) {
      newErrors.plant_address = '発電所住所は必須です'
    }

    if (!formData.prefecture) {
      newErrors.prefecture = '都道府県は必須です'
    }

    if (!formData.city.trim()) {
      newErrors.city = '市区町村は必須です'
    }

    if (!formData.owner.trim()) {
      newErrors.owner = '所有者は必須です'
    }

    if (formData.dc_capacity < 0) {
      newErrors.dc_capacity = '設備容量（DCkW）は0以上で入力してください'
    }

    if (formData.ac_capacity < 0) {
      newErrors.ac_capacity = '設備容量（ACkW）は0以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">新しい発電所を登録</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 発電所名 */}
          <div>
            <label htmlFor="plant_name" className="block text-sm font-medium text-gray-700 mb-2">
              発電所名 *
            </label>
            <input
              type="text"
              id="plant_name"
              name="plant_name"
              value={formData.plant_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.plant_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 〇〇太陽光発電所"
            />
            {errors.plant_name && (
              <p className="mt-1 text-sm text-red-600">{errors.plant_name}</p>
            )}
          </div>

          {/* 所有者 */}
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-2">
              所有者 *
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.owner ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 株式会社〇〇"
            />
            {errors.owner && (
              <p className="mt-1 text-sm text-red-600">{errors.owner}</p>
            )}
          </div>

          {/* 都道府県 */}
          <div>
            <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-2">
              都道府県 *
            </label>
            <select
              id="prefecture"
              name="prefecture"
              value={formData.prefecture}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.prefecture ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">都道府県を選択</option>
              {prefectures.map(prefecture => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
            {errors.prefecture && (
              <p className="mt-1 text-sm text-red-600">{errors.prefecture}</p>
            )}
          </div>

          {/* 市区町村 */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              市区町村 *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 〇〇市〇〇町"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* 設備容量（DCkW） */}
          <div>
            <label htmlFor="dc_capacity" className="block text-sm font-medium text-gray-700 mb-2">
              設備容量（DCkW）
            </label>
            <input
              type="number"
              id="dc_capacity"
              name="dc_capacity"
              value={formData.dc_capacity}
              onChange={handleChange}
              step="0.1"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dc_capacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.0"
            />
            {errors.dc_capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.dc_capacity}</p>
            )}
          </div>

          {/* 設備容量（ACkW） */}
          <div>
            <label htmlFor="ac_capacity" className="block text-sm font-medium text-gray-700 mb-2">
              設備容量（ACkW）
            </label>
            <input
              type="number"
              id="ac_capacity"
              name="ac_capacity"
              value={formData.ac_capacity}
              onChange={handleChange}
              step="0.1"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ac_capacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.0"
            />
            {errors.ac_capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.ac_capacity}</p>
            )}
          </div>

          {/* 運転開始日 */}
          <div>
            <label htmlFor="operation_start_date" className="block text-sm font-medium text-gray-700 mb-2">
              運転開始日
            </label>
            <input
              type="date"
              id="operation_start_date"
              name="operation_start_date"
              value={formData.operation_start_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 発電所住所 */}
        <div>
          <label htmlFor="plant_address" className="block text-sm font-medium text-gray-700 mb-2">
            発電所住所 *
          </label>
          <input
            type="text"
            id="plant_address"
            name="plant_address"
            value={formData.plant_address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.plant_address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例: 〇〇県〇〇市〇〇町1-2-3"
          />
          {errors.plant_address && (
            <p className="mt-1 text-sm text-red-600">{errors.plant_address}</p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
