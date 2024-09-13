'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Billing() {
  const [userId, setUserId] = useState('')
  const [billDate, setBillDate] = useState('')
  const [amount, setAmount] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('water_bills')
        .insert({
          user_id: userId,
          bill_date: billDate,
          amount: parseFloat(amount),
        })
      if (error) throw error
      router.push('/home')
    } catch (error) {
      console.error('Error submitting bill:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">水道料金の請求</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Bill Date"
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          請求を登録
        </button>
      </form>
    </div>
  )
}