'use client'

import { useState } from 'react'
import { usePowerPlants } from '@/hooks/usePowerPlants'
import { PowerPlant } from '@/lib/supabase'
import EditPowerPlantForm from '@/components/EditPowerPlantForm'
import PowerPlantCard from '@/components/PowerPlantCard'

export default function Home() {
  const { powerPlants, loading, error, updatePowerPlant, deletePowerPlant } = usePowerPlants()
  const [editingPowerPlant, setEditingPowerPlant] = useState<PowerPlant | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  const handleUpdatePowerPlant = async (id: number, powerPlantData: any) => {
    try {
      await updatePowerPlant(id, powerPlantData)
      setEditingPowerPlant(null)
      setPageError(null)
    } catch (err) {
      setPageError('発電所データの更新に失敗しました')
    }
  }

  const handleDeletePowerPlant = async (id: number) => {
    try {
      await deletePowerPlant(id)
      setPageError(null)
    } catch (err) {
      setPageError('発電所データの削除に失敗しました')
    }
  }

  const handleEditPowerPlant = (powerPlant: PowerPlant) => {
    setEditingPowerPlant(powerPlant)
  }

  // 統計データの計算
  const totalPlants = powerPlants.length
  const totalDCCapacity = powerPlants.reduce((sum, plant) => sum + (plant.dc_capacity || 0), 0)
  const totalACCapacity = powerPlants.reduce((sum, plant) => sum + (plant.ac_capacity || 0), 0)
  const uniquePrefectures = new Set(powerPlants.map(plant => plant.prefecture)).size
  const categoryCounts = powerPlants.reduce((acc, plant) => {
    acc[plant.category] = (acc[plant.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
            <p className="text-gray-600">発電所データの概要と統計情報</p>
          </div>

          {/* エラーメッセージ */}
          {(error || pageError) && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error || pageError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 統計情報 */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPlants}</div>
              <div className="text-sm text-gray-600">登録発電所数</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{totalDCCapacity.toFixed(1)}</div>
              <div className="text-sm text-gray-600">総DC容量(kW)</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalACCapacity.toFixed(1)}</div>
              <div className="text-sm text-gray-600">総AC容量(kW)</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{uniquePrefectures}</div>
              <div className="text-sm text-gray-600">都道府県数</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-indigo-600">{Object.keys(categoryCounts).length}</div>
              <div className="text-sm text-gray-600">カテゴリ数</div>
            </div>
          </div>

          {/* カテゴリ別統計 */}
          {Object.keys(categoryCounts).length > 0 && (
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別統計</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 編集フォーム */}
          {editingPowerPlant && (
            <div className="mb-8">
              <EditPowerPlantForm
                powerPlant={editingPowerPlant}
                onSubmit={handleUpdatePowerPlant}
                onCancel={() => setEditingPowerPlant(null)}
              />
            </div>
          )}

          {/* 発電所一覧 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">登録発電所一覧</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {powerPlants.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏭</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">発電所データがありません</h3>
                    <p className="text-gray-500">サイドバーの「発電所登録」から新しい発電所を登録してください</p>
                  </div>
                ) : (
                  powerPlants.map((powerPlant) => (
                    <PowerPlantCard
                      key={powerPlant.id}
                      powerPlant={powerPlant}
                      onEdit={handleEditPowerPlant}
                      onDelete={handleDeletePowerPlant}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
