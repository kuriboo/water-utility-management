import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from './lib/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })

  const { data: { session }, error } = await supabase.auth.getSession()

  /*console.log('ミドルウェアでのセッションデータ:', session)
  console.log('ミドルウェアでのエラー:', error)

  if(session){
    console.log('セッションがあります');
  }else{
    console.log('セッションがありません');
  }*/

  if ( session && req.nextUrl.pathname.startsWith('/home') ) {
    // セッションがある場合、ユーザー情報を確認
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !userData) {
      // ユーザー情報がない場合、ログイン画面にリダイレクト
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // 保護されたルートに対するユーザー認証チェック
  if (!session && (
    req.nextUrl.pathname.startsWith('/home') ||
    req.nextUrl.pathname.startsWith('/edit-profile') ||
    req.nextUrl.pathname.startsWith('/billing')
  )) {
    // 絶対URLを使用してリダイレクト
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// オプションで、このミドルウェアを適用するルートを指定できます
export const config = {
    matcher: ['/home/:path*', '/edit-profile/:path*', '/billing/:path*'/*, '/login/:path*'*/],
}