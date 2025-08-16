'use client'

import { useState, useEffect } from 'react'
import { PowerPlant, UpdatePowerPlantData } from '@/lib/supabase'
import { parseAddress, validateAddress } from '@/lib/addressParser'

interface EditPowerPlantFormProps {
  powerPlant: PowerPlant
  onSubmit: (id: number, data: UpdatePowerPlantData) => void
  onCancel: () => void
}

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

export default function EditPowerPlantForm({ powerPlant, onSubmit, onCancel }: EditPowerPlantFormProps) {
  const [formData, setFormData] = useState<Omit<UpdatePowerPlantData, 'prefecture' | 'city'>>({
    plant_name: powerPlant.plant_name,
    plant_address: powerPlant.plant_address,
    owner: powerPlant.owner,
    dc_capacity: powerPlant.dc_capacity,
    ac_capacity: powerPlant.ac_capacity,
    operation_start_date: powerPlant.operation_start_date,
    category: powerPlant.category
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [parsedAddress, setParsedAddress] = useState<{ prefecture: string; city: string } | null>({
    prefecture: powerPlant.prefecture,
    city: powerPlant.city
  })

  useEffect(() => {
    setFormData({
      plant_name: powerPlant.plant_name,
      plant_address: powerPlant.plant_address,
      owner: powerPlant.owner,
      dc_capacity: powerPlant.dc_capacity,
      ac_capacity: powerPlant.ac_capacity,
      operation_start_date: powerPlant.operation_start_date,
      category: powerPlant.category
    })
    setParsedAddress({
      prefecture: powerPlant.prefecture,
      city: powerPlant.city
    })
  }, [powerPlant])

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

    // 住所が変更された場合、解析結果をクリア
    if (name === 'plant_address') {
      setParsedAddress(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.plant_name?.trim()) {
      newErrors.plant_name = '発電所名は必須です'
    }

    if (!formData.plant_address?.trim()) {
      newErrors.plant_address = '発電所住所は必須です'
    } else {
      // 住所の妥当性をチェック
      const addressValidation = validateAddress(formData.plant_address)
      if (!addressValidation.isValid) {
        newErrors.plant_address = addressValidation.error || '住所の形式が正しくありません'
      }
    }

    if (!formData.owner?.trim()) {
      newErrors.owner = '所有者は必須です'
    }

    if (formData.dc_capacity !== undefined && formData.dc_capacity < 0) {
      newErrors.dc_capacity = '設備容量（DCkW）は0以上で入力してください'
    }

    if (formData.ac_capacity !== undefined && formData.ac_capacity < 0) {
      newErrors.ac_capacity = '設備容量（ACkW）は0以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // 住所を解析
      const addressInfo = parseAddress(formData.plant_address || '')
      if (!addressInfo) {
        setErrors(prev => ({ ...prev, plant_address: '住所の解析に失敗しました' }))
        return
      }

      // 解析結果を表示
      setParsedAddress({
        prefecture: addressInfo.prefecture,
        city: addressInfo.city
      })

      // 完全なデータを作成
      const completeData: UpdatePowerPlantData = {
        ...formData,
        prefecture: addressInfo.prefecture,
        city: addressInfo.city
      }

      onSubmit(powerPlant.id, completeData)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">発電所情報を編集</h2>
      
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
              value={formData.plant_name || ''}
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
              value={formData.owner || ''}
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

          {/* 設備容量（DCkW） */}
          <div>
            <label htmlFor="dc_capacity" className="block text-sm font-medium text-gray-700 mb-2">
              設備容量（DCkW）
            </label>
            <input
              type="number"
              id="dc_capacity"
              name="dc_capacity"
              value={formData.dc_capacity || 0}
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
              value={formData.ac_capacity || 0}
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
              value={formData.operation_start_date || ''}
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
              value={formData.category || 'その他'}
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
            value={formData.plant_address || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.plant_address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例: 東京都渋谷区渋谷1-1-1"
          />
          {errors.plant_address && (
            <p className="mt-1 text-sm text-red-600">{errors.plant_address}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            住所を入力すると、都道府県と市区町村が自動的に解析されます
          </p>
        </div>

        {/* 解析結果の表示 */}
        {parsedAddress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">住所解析結果</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">都道府県:</span>
                <span className="ml-2 text-blue-800">{parsedAddress.prefecture}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">市区町村:</span>
                <span className="ml-2 text-blue-800">{parsedAddress.city}</span>
              </div>
            </div>
          </div>
        )}

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
            更新
          </button>
        </div>
      </form>
    </div>
  )
}
