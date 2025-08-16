'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-50">
      <div className="p-6">
        {/* ロゴ・タイトル */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">発電所管理システム</h1>
          <p className="text-sm text-gray-600 mt-1">Solar Power Plant Manager</p>
        </div>

        {/* ナビゲーション */}
        <nav className="space-y-2">
          <Link
            href="/"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            ダッシュボード
          </Link>

          <Link
            href="/register"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/register')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            発電所登録
          </Link>
        </nav>

        {/* システム情報 */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-xs text-gray-500 text-center">
            <p>Next.js + Supabase</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
