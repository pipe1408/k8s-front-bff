'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}

interface Guest {
  name: string
  timestamp: string
}

export default function TimeDisplayWithGuestbook() {
  const [time, setTime] = useState<TimeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const fetchTime = async () => {
    setLoading(true)
    try {
      const response = await fetch('/current-time')
      if (!response.ok) {
        throw new Error('Failed to fetch time')
      }
      const data: TimeData = await response.json()
      setTime(data)
      setMessage('')
    } catch (error) {
      console.error('Error fetching time:', error)
      setMessage('Failed to fetch the current time. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTime()
  }, [])

  const formatTime = (time: TimeData) => {
    return `${time.year}-${String(time.month).padStart(2, '0')}-${String(time.day).padStart(2, '0')} ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}.${String(time.millisecond).padStart(3, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: guestName }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit guest name')
      }

      const newGuest: Guest = {
        name: guestName,
        timestamp: new Date().toISOString(),
      }

      setGuests(prevGuests => [newGuest, ...prevGuests.slice(0, 4)])
      setGuestName('')
      setMessage('Your name has been added to the guestbook!')
    } catch (error) {
      console.error('Error submitting guest name:', error)
      setMessage('Failed to add your name to the guestbook. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {time ? (
              <p className="text-2xl font-bold mb-4">{formatTime(time)}</p>
            ) : (
              <p className="text-lg mb-4">Loading time...</p>
            )}
            <Button onClick={fetchTime} disabled={loading}>
              {loading ? 'Updating...' : 'Update Time'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guestbook</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Your Name</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Signing...' : 'Sign Guestbook'}
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-2 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recent Guests</h3>
            {guests.length > 0 ? (
              <ul className="space-y-2">
                {guests.map((guest, index) => (
                  <li key={index} className="text-sm">
                    {guest.name} - {new Date(guest.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No guests yet. Be the first to sign!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}