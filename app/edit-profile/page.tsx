'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

interface UserData {
    id: string;
    email: string;
    name: string;
    birthdate: string;
    address: string;
}

export default function EditProfilePage() {
  //const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<UserData | null>(null)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [address, setAddress] = useState('')
  const router = useRouter()

  useEffect(() => { 
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        if (error) {
          console.error('Error fetching user data:', error)
        } else {
          setUser(data)
          setName(data.name)
          setBirthdate(data.birthdate)
          setAddress(data.address)
        }
      } else {
        router.push('/login')
      }
    }
    
    fetchUserData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return // ユーザーがnullの場合、早期リターン
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          birthdate,
          address,
        })
        .eq('id', user.id)
      if (error) throw error
      router.push('/home')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー情報の編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          更新
        </button>
      </form>
    </div>
  )
}