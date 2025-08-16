import { useState, useEffect } from 'react'
import { PowerPlant, CreatePowerPlantData, UpdatePowerPlantData } from '@/lib/supabase'

export function usePowerPlants() {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 発電所一覧を取得
  const fetchPowerPlants = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/power-plants')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '発電所データの取得に失敗しました')
      }
      
      const data = await response.json()
      setPowerPlants(data)
    } catch (err) {
      console.error('発電所データ取得エラー:', err)
      setError(err instanceof Error ? err.message : '発電所データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 発電所を作成
  const createPowerPlant = async (powerPlantData: CreatePowerPlantData) => {
    try {
      setError(null)
      
      const response = await fetch('/api/power-plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(powerPlantData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '発電所データの作成に失敗しました')
      }

      const newPowerPlant = await response.json()
      setPowerPlants(prev => [...prev, newPowerPlant])
      return newPowerPlant
    } catch (err) {
      console.error('発電所作成エラー:', err)
      const errorMessage = err instanceof Error ? err.message : '発電所データの作成に失敗しました'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // 発電所を更新
  const updatePowerPlant = async (id: number, powerPlantData: UpdatePowerPlantData) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/power-plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(powerPlantData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '発電所データの更新に失敗しました')
      }

      const updatedPowerPlant = await response.json()
      setPowerPlants(prev => 
        prev.map(plant => 
          plant.id === id ? updatedPowerPlant : plant
        )
      )
      return updatedPowerPlant
    } catch (err) {
      console.error('発電所更新エラー:', err)
      const errorMessage = err instanceof Error ? err.message : '発電所データの更新に失敗しました'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // 発電所を削除
  const deletePowerPlant = async (id: number) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/power-plants/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '発電所データの削除に失敗しました')
      }

      setPowerPlants(prev => prev.filter(plant => plant.id !== id))
    } catch (err) {
      console.error('発電所削除エラー:', err)
      const errorMessage = err instanceof Error ? err.message : '発電所データの削除に失敗しました'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchPowerPlants()
  }, [])

  return {
    powerPlants,
    loading,
    error,
    createPowerPlant,
    updatePowerPlant,
    deletePowerPlant,
    refetch: fetchPowerPlants,
  }
}
