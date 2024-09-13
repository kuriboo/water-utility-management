'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SignUpForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [address, setAddress] = useState('')
    const [message, setMessage] = useState('')
  
    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault()
      setMessage('')
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, birthdate, address }
          }
        })
        
        if (error) throw error
        
        setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。')
        
      } catch (error) {
        console.error('Error signing up:', error)
        setMessage('サインアップ中にエラーが発生しました。もう一度お試しください。： ' + error)
      }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      
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
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Birthdate"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Sign Up
      </button>

      {message && (
        <div className="text-red-500 text-sm">{message}</div>
      )}
    </form>
  )
}