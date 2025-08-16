'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePowerPlants } from '@/hooks/usePowerPlants'
import PowerPlantForm from '@/components/PowerPlantForm'

export default function RegisterPage() {
  const router = useRouter()
  const { createPowerPlant } = usePowerPlants()
  const [pageError, setPageError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePowerPlant = async (powerPlantData: any) => {
    try {
      setIsSubmitting(true)
      setPageError(null)
      await createPowerPlant(powerPlantData)
      
      // 登録成功後、ダッシュボードにリダイレクト
      router.push('/')
    } catch (err) {
      setPageError('発電所データの作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">発電所登録</h1>
            <p className="text-gray-600">新しい発電所の情報を入力してください</p>
          </div>

          {/* エラーメッセージ */}
          {pageError && (
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
                    <p>{pageError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 登録フォーム */}
          <PowerPlantForm
            onSubmit={handleCreatePowerPlant}
            onCancel={handleCancel}
          />

          {/* 送信中の表示 */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-700">発電所データを登録中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
