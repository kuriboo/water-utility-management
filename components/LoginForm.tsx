'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const { data,error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // セッションが確実に設定されるまで少し待機
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (data.user) {

        // ユーザーがusersテーブルに存在するか確認
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select()
          .eq('id', data.user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (!existingUser) {
          // ユーザーが存在しない場合、新しく挿入
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata.name,
              birthdate: data.user.user_metadata.birthdate,
              address: data.user.user_metadata.address,
            })

          if (insertError) throw insertError
        }
    
        console.log('home画面へ移行')
        router.push('/home')

      }
    } catch (error) {
      console.error('ログインエラー:', error)
      setMessage('ログイン中にエラーが発生しました。もう一度お試しください。')
    }
  }


  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Log In
      </button>
      {message && (
        <div className="text-red-500 text-sm">{message}</div>
      )}
    </form>
  )
}