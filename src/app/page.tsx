'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/lib/supabase'
import TaskForm from '@/components/TaskForm'
import EditTaskForm from '@/components/EditTaskForm'
import TaskCard from '@/components/TaskCard'

export default function Home() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData)
    setShowCreateForm(false)
  }

  const handleUpdateTask = async (id: number, taskData: any) => {
    await updateTask(id, taskData)
    setEditingTask(null)
  }

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">エラーが発生しました</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">タスク管理アプリ</h1>
            <p className="text-gray-600">Next.js + Supabase で作成されたシンプルなCRUDアプリ</p>
          </div>

          {/* 新規作成ボタン */}
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              新しいタスクを作成
            </button>
          </div>

          {/* 新規作成フォーム */}
          {showCreateForm && (
            <div className="mb-8">
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* 編集フォーム */}
          {editingTask && (
            <div className="mb-8">
              <EditTaskForm
                task={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          )}

          {/* タスク一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">タスクがありません</h3>
                <p className="text-gray-500">新しいタスクを作成してみましょう！</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>

          {/* 統計情報 */}
          {tasks.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">統計情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">未着手</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600">進行中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">完了</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
