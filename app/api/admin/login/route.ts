import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 環境変数から管理者認証情報を取得
    const adminEmail = process.env.ADMIN_MAIL_ADDRESS
    const adminPassword = process.env.ADMIN_PASSWORD

    // 認証情報の確認
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { message: '管理者認証情報が設定されていません' },
        { status: 500 }
      )
    }

    // 認証チェック
    if (email === adminEmail && password === adminPassword) {
      // 認証成功
      return NextResponse.json(
        { 
          message: 'ログイン成功',
          isAdmin: true 
        },
        { status: 200 }
      )
    } else {
      // 認証失敗
      return NextResponse.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
