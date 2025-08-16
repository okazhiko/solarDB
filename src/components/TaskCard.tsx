'use client'

import { Task } from '@/lib/supabase'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '未着手'
      case 'in_progress':
        return '進行中'
      case 'completed':
        return '完了'
      default:
        return status
    }
  }

  const handleDelete = () => {
    if (confirm('このタスクを削除しますか？')) {
      onDelete(task.id)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
          {task.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {getStatusText(task.status)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {task.description}
      </p>
      
      <div className="text-xs text-gray-500 mb-4">
        <div>作成日: {new Date(task.created_at).toLocaleDateString('ja-JP')}</div>
        <div>更新日: {new Date(task.updated_at).toLocaleDateString('ja-JP')}</div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          編集
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          削除
        </button>
      </div>
    </div>
  )
}
