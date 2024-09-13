'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'


// ユーザーデータの型定義
interface UserData {
  id: string;
  email: string;
  name: string;
  birthdate: string;
  address: string;
}

export default function HomePage() {

  const [user, setUser] = useState<UserData | null>(null)
  const [currentBill, setCurrentBill] = useState<number | null>(null)
  const router = useRouter()
  const [hasBill, setHasBill] = useState<boolean>(false)
  const [currentDate, setCurrentDate] = useState<string>('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  };

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          console.log('fetchUserData start')
          if (authUser) {
            console.log('認証されたユーザー:', authUser)
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', authUser.id)
              .single()
            if (error) throw error
            console.log('取得したユーザーデータ:', data)
            setUser(data as UserData)
          } else {
            console.log('認証されたユーザーがいません')
            router.push('/login')
          }
        } catch (err) {
          console.error('ユーザーデータの取得中にエラーが発生しました:', err)
          // エラーメッセージを表示するなどの処理を追加
        }
      }

    const fetchCurrentBill = async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          if (authUser) {
            const { data, error } = await supabase
              .from('water_bills')
              .select('amount')
              .eq('user_id', authUser.id)
              .order('bill_date', { ascending: false })
              .limit(1)
              .single()
            if (error) {
              if (error.code === 'PGRST116') {
                // データが見つからない場合
                setHasBill(false)
                setCurrentBill(null)
              } else {
                throw error
              }
            } else {
              setHasBill(true)
              setCurrentBill(data?.amount || null)
            }
          }
        } catch (err) {
          //setError('請求情報の取得中にエラーが発生しました')
          console.error('Error fetching current bill:', err)
        }
      }

    // 現在の日付を設定
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    setCurrentDate(`${year}年${month}月`)

    fetchUserData()
    fetchCurrentBill()
  }, [router])

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">水道料金管理システム</h1>
      <p className="text-xl font-semibold mb-4 text-center text-gray-700">{currentDate}</p>
      {user && (
        <div className="bg-white shadow-lg rounded-lg px-8 py-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">個人情報</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium">名前:</span> {user.name}</p>
            <p><span className="font-medium">生年月日:</span> {user.birthdate}</p>
            <p><span className="font-medium">住所:</span> {user.address}</p>
            <p><span className="font-medium">今月の水道料金:</span> {hasBill ? (currentBill ? `${currentBill.toLocaleString()}円` : '請求情報の取得中...') : '請求なし'}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        <button
          onClick={() => router.push('/edit-profile')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          ユーザー情報の編集
        </button>
        <button
          onClick={() => router.push('/billing')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          水道料金の請求
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}