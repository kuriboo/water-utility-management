import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClientComponentClient({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
})

// For server-side usage
export const createSupabaseClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey)
}

// クライアントサイドの使用のために更新
export const createClientSideClient = () => {
    return createClientComponentClient({
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseAnonKey,
    })
}

// ミドルウェアの使用のために更新
export const createMiddlewareSupabaseClient = (context: { req: any; res: any }) => {
    return createMiddlewareClient(
      { req: context.req, res: context.res },
      { supabaseUrl: supabaseUrl, supabaseKey: supabaseAnonKey }
    )
}