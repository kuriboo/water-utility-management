'use client'

import { useState } from 'react'
import LoginForm from '../../components/LoginForm'
import SignUpForm from '../../components/SignUpForm'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'ログイン' : 'サインアップ'}
      </h1>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'アカウントを作成' : 'ログインに戻る'}
        </button>
      </div>
    </div>
  )
}