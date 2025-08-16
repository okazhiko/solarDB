import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 特定のタスクを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'タスクの取得に失敗しました' }, { status: 500 })
  }
}

// タスクを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, status } = body

    const { data, error } = await supabase
      .from('tasks')
      .update({ title, description, status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'タスクの更新に失敗しました' }, { status: 500 })
  }
}

// タスクを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'タスクが削除されました' })
  } catch (error) {
    return NextResponse.json({ error: 'タスクの削除に失敗しました' }, { status: 500 })
  }
}
