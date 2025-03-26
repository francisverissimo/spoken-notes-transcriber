import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/button'

interface NewNoteRecordingModeProps {
  onStop(data: string): void
  onPreferToType(): void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteRecordingMode({ onStop }: NewNoteRecordingModeProps) {
  const divRef = useRef<HTMLDivElement>(null)

  function getDivContent() {
    const divEl = divRef.current
    return divEl ? divEl.textContent : ''
  }

  function setDivContent(value: string) {
    const divEl = divRef.current
    if (divEl) divEl.innerText = value
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      /** futuramente, tratar de forma mais elaborada */
      toast.error('Infelizmente seu navegador não suporta o reconhecimento de fala.')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setDivContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    if (!speechRecognition) {
      return
    }

    speechRecognition.stop()
    speechRecognition = null

    const transcribed = getDivContent()
    onStop(transcribed ?? '')
  }

  useEffect(() => {
    if (speechRecognition) return
    handleStartRecording()

    return () => {
      if (speechRecognition) {
        speechRecognition.stop()
        speechRecognition = null
      }
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex h-full w-full flex-col">
          <div
            className="scrollbar-hide flex-1 resize-none rounded-xl bg-slate-600/30 p-2 text-lg leading-6 text-slate-200 outline-none transition focus:shadow-2xl data-[hidden=true]:hidden"
            ref={divRef}
          />
        </div>
      </div>

      <div className="px-2 pb-2">
        <Button
          type="button"
          color="slate-300"
          className="gap-2 md:translate-y-4"
          onClick={handleStopRecording}
        >
          <div className="size-5 animate-pulse rounded-full bg-red-500" />
          Gravando! (clique p/ interromper)
        </Button>
      </div>
    </div>
  )
}
