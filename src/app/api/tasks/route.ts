import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// タスク一覧を取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'タスクの取得に失敗しました' }, { status: 500 })
  }
}

// 新しいタスクを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'タイトルと説明は必須です' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description, status: status || 'pending' }])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'タスクの作成に失敗しました' }, { status: 500 })
  }
}
