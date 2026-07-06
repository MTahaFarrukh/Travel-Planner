import { useEffect, useState } from 'react'
import { loadLeafletStyles } from '../utils/loadLeafletStyles'

export function useLeafletReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadLeafletStyles().then(() => {
      if (active) setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  return ready
}
