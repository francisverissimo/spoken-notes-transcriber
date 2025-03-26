import { useEffect, useRef } from 'react'
import { Keyboard, Mic } from 'lucide-react'

interface NewNoteModeSelectorProps {
  onStartRecording: () => void
  onStartWriting: () => void
}

export function NewNoteModeSelector({
  onStartRecording,
  onStartWriting,
}: NewNoteModeSelectorProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setTimeout(() => {
      const [transcribedButton, writtingButton] = buttonsRef.current
      if (transcribedButton != document.activeElement && writtingButton != document.activeElement) {
        transcribedButton?.focus()
      }
    }, 800)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-5 md:flex-row">
      <button
        type="button"
        ref={(el) => (buttonsRef.current[0] = el)}
        onClick={onStartRecording}
        className="rounded-4xl flex h-[25%] w-full items-center justify-center gap-2 bg-slate-800 px-2 py-4 text-lg text-lime-400 outline-none focus-within:ring hover:underline md:h-[50%]"
      >
        <Mic /> transcrever texto falando
      </button>

      <button
        type="button"
        ref={(el) => (buttonsRef.current[1] = el)}
        onClick={onStartWriting}
        className="rounded-4xl flex h-[25%] w-full items-center justify-center gap-2 bg-slate-800 px-2 py-4 text-lg text-slate-300 outline-none focus-within:ring hover:underline md:h-[50%]"
      >
        <Keyboard /> escrever nota
      </button>
    </div>
  )
}
