'use client'

import { PowerPlant } from '@/lib/supabase'

interface PowerPlantCardProps {
  powerPlant: PowerPlant
  onEdit: (powerPlant: PowerPlant) => void
  onDelete: (id: number) => void
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case '住宅用太陽光発電':
      return 'bg-blue-100 text-blue-800'
    case '産業用太陽光発電':
      return 'bg-green-100 text-green-800'
    case 'メガソーラー':
      return 'bg-yellow-100 text-yellow-800'
    case '風力発電':
      return 'bg-purple-100 text-purple-800'
    case '水力発電':
      return 'bg-cyan-100 text-cyan-800'
    case '地熱発電':
      return 'bg-orange-100 text-orange-800'
    case 'バイオマス発電':
      return 'bg-emerald-100 text-emerald-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function PowerPlantCard({ powerPlant, onEdit, onDelete }: PowerPlantCardProps) {
  const handleDelete = () => {
    if (confirm('この発電所データを削除しますか？')) {
      onDelete(powerPlant.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {powerPlant.plant_name}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(powerPlant.category)}`}>
            {powerPlant.category}
          </span>
        </div>

        {/* 基本情報 */}
        <div className="space-y-3 mb-4">
          <div>
            <span className="text-sm font-medium text-gray-500">所有者:</span>
            <p className="text-sm text-gray-900">{powerPlant.owner}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">所在地:</span>
            <p className="text-sm text-gray-900">
              {powerPlant.prefecture} {powerPlant.city}
            </p>
            <p className="text-xs text-gray-600 mt-1">{powerPlant.plant_address}</p>
          </div>

          {/* 設備容量 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">DC容量:</span>
              <p className="text-sm text-gray-900 font-semibold">
                {powerPlant.dc_capacity.toFixed(1)} kW
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">AC容量:</span>
              <p className="text-sm text-gray-900 font-semibold">
                {powerPlant.ac_capacity.toFixed(1)} kW
              </p>
            </div>
          </div>

          {/* 運転開始日 */}
          {powerPlant.operation_start_date && (
            <div>
              <span className="text-sm font-medium text-gray-500">運転開始日:</span>
              <p className="text-sm text-gray-900">
                {new Date(powerPlant.operation_start_date).toLocaleDateString('ja-JP')}
              </p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            ID: {powerPlant.id}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(powerPlant)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
