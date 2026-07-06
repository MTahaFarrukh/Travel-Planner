import { useState } from 'react'
import FloatingAssistant from './assistant/FloatingAssistant'

export default function AssistantLauncher() {
  const [open, setOpen] = useState(false)

  return <FloatingAssistant open={open} onOpenChange={setOpen} />
}
