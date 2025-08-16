'use client'

import { useState, useEffect } from 'react'
import { Task, UpdateTaskData } from '@/lib/supabase'

interface EditTaskFormProps {
  task: Task
  onSubmit: (id: number, taskData: UpdateTaskData) => Promise<void>
  onCancel: () => void
}

export default function EditTaskForm({ task, onSubmit, onCancel }: EditTaskFormProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    })
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('タイトルと説明を入力してください')
      return
    }

    setLoading(true)
    try {
      await onSubmit(task.id, formData)
    } catch (error) {
      console.error('タスク更新エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">タスクを編集</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル *
          </label>
          <input
            type="text"
            id="edit-title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タスクのタイトルを入力"
            required
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
            説明 *
          </label>
          <textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="タスクの詳細を入力"
            required
          />
        </div>

        <div>
          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            id="edit-status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? '更新中...' : '更新'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
