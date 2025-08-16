import { useState, useEffect } from 'react'
import { Task, CreateTaskData, UpdateTaskData } from '@/lib/supabase'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // タスク一覧を取得
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('タスクの取得に失敗しました')
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // 新しいタスクを作成
  const createTask = async (taskData: CreateTaskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('タスクの作成に失敗しました')
      const newTask = await response.json()
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      throw err
    }
  }

  // タスクを更新
  const updateTask = async (id: number, taskData: UpdateTaskData) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('タスクの更新に失敗しました')
      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      throw err
    }
  }

  // タスクを削除
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('タスクの削除に失敗しました')
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  }
}
