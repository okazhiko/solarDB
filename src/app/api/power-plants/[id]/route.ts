import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 特定の発電所を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('power_plants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '発電所が見つかりません' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '発電所データの取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 発電所を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // 数値フィールドの検証
    if (body.dc_capacity !== undefined && (typeof body.dc_capacity !== 'number' || body.dc_capacity < 0)) {
      return NextResponse.json(
        { error: '設備容量（DCkW）は0以上の数値を入力してください' },
        { status: 400 }
      )
    }

    if (body.ac_capacity !== undefined && (typeof body.ac_capacity !== 'number' || body.ac_capacity < 0)) {
      return NextResponse.json(
        { error: '設備容量（ACkW）は0以上の数値を入力してください' },
        { status: 400 }
      )
    }

    // 更新データの準備
    const updateData: any = {}
    if (body.plant_name !== undefined) updateData.plant_name = body.plant_name.trim()
    if (body.plant_address !== undefined) updateData.plant_address = body.plant_address.trim()
    if (body.prefecture !== undefined) updateData.prefecture = body.prefecture
    if (body.city !== undefined) updateData.city = body.city.trim()
    if (body.owner !== undefined) updateData.owner = body.owner.trim()
    if (body.dc_capacity !== undefined) updateData.dc_capacity = body.dc_capacity
    if (body.ac_capacity !== undefined) updateData.ac_capacity = body.ac_capacity
    if (body.operation_start_date !== undefined) updateData.operation_start_date = body.operation_start_date
    if (body.category !== undefined) updateData.category = body.category

    const { data, error } = await supabase
      .from('power_plants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '発電所が見つかりません' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: '発電所データの更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 発電所を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('power_plants')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { error: '発電所データの削除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: '発電所データを削除しました' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
