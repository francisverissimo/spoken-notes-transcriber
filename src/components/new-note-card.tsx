import { ChangeEvent, FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface NewNoteCardProps {
  handleCreateNote: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ handleCreateNote }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleShowOnboarding() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value == '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (!content) {
      toast.warning('Por favor, escreva algo.')
      return
    }

    handleCreateNote(content)

    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Infelizmente seu navegador não suporta o reconhecimento de fala.')
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

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

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-y-3 rounded-md bg-slate-700 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 outline-none hover:text-red-400 focus-visible:text-red-400">
            <X className="size-5" />
          </Dialog.Close>

          <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">Adicionar uma nota</span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="text-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    onClick={handleShowOnboarding}
                    className="text-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="flex-1 resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            <button
              type="button"
              data-recording={isRecording}
              onClick={handleStopRecording}
              className="hidden w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none transition hover:text-slate-100 data-[recording=true]:flex"
            >
              <div className="size-3 animate-pulse rounded-full bg-red-500" />
              Gravando! (clique p/ interromper)
            </button>

            <button
              type="submit"
              // disabled={!content}
              data-recording={isRecording}
              className="w-full bg-lime-400 py-4 text-center text-sm font-medium text-lime-950 outline-none transition hover:bg-lime-500 disabled:cursor-not-allowed data-[recording=true]:hidden"
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
