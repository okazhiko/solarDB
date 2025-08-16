import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 発電所一覧を取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('power_plants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
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

// 発電所を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 必須フィールドの検証
    const requiredFields = ['plant_name', 'plant_address', 'prefecture', 'city', 'owner']
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          { error: `${field}は必須項目です` },
          { status: 400 }
        )
      }
    }

    // 数値フィールドの検証
    if (typeof body.dc_capacity !== 'number' || body.dc_capacity < 0) {
      return NextResponse.json(
        { error: '設備容量（DCkW）は0以上の数値を入力してください' },
        { status: 400 }
      )
    }

    if (typeof body.ac_capacity !== 'number' || body.ac_capacity < 0) {
      return NextResponse.json(
        { error: '設備容量（ACkW）は0以上の数値を入力してください' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('power_plants')
      .insert([{
        plant_name: body.plant_name.trim(),
        plant_address: body.plant_address.trim(),
        prefecture: body.prefecture,
        city: body.city.trim(),
        owner: body.owner.trim(),
        dc_capacity: body.dc_capacity,
        ac_capacity: body.ac_capacity,
        operation_start_date: body.operation_start_date,
        category: body.category || 'その他'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: '発電所データの作成に失敗しました' },
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
