import { ChangeEvent, FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { ChevronLeft, X } from 'lucide-react'
import { TextareaEditor } from './textarea-editor'

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
    <Dialog.Root
      onOpenChange={(openValue) => {
        if (!openValue && !content && !shouldShowOnboarding) {
          setShouldShowOnboarding(true)
        }
      }}
    >
      <Dialog.Trigger className="relative flex flex-col gap-y-3 rounded-md bg-lime-700/30 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-lg font-medium text-slate-200">Adicionar nota</span>
        <p className="text-lg leading-6 text-slate-200">
          Escreva ou fale, que seu áudio será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 rounded-full bg-slate-800 p-4 text-slate-400 outline-none hover:text-red-400 focus-visible:text-red-400 md:-right-2 md:-top-2">
            <X className="size-5" />
          </Dialog.Close>

          <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-normal text-cyan-400">Adicionar uma nota</span>

                {!isRecording && !shouldShowOnboarding && (
                  <button
                    onClick={() => setShouldShowOnboarding(true)}
                    className="text-md flex items-center self-start text-slate-900"
                  >
                    <ChevronLeft className="size-10 rounded-full bg-slate-300 p-2.5 text-sm" />
                    <span className="-translate-x-3 rounded-r-full bg-slate-300 px-3 py-1">
                      Voltar a tela anterior
                    </span>
                  </button>
                )}
              </div>

              {shouldShowOnboarding ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="rounded-full bg-slate-800 px-2 py-4 text-lg text-lime-400 hover:underline"
                  >
                    Transcrever áudio para texto
                  </button>

                  <button
                    type="button"
                    onClick={handleShowOnboarding}
                    className="rounded-full bg-slate-800 px-2 py-4 text-lg text-slate-300 hover:underline"
                  >
                    Escrever nota
                  </button>
                </div>
              ) : (
                <TextareaEditor content={content} handleContentChange={handleContentChange} />
              )}
            </div>

            <button
              type="button"
              data-recording={isRecording}
              onClick={handleStopRecording}
              className="hidden w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-lg font-medium text-slate-300 outline-none transition hover:text-slate-100 data-[recording=true]:flex"
            >
              <div className="size-3 animate-pulse rounded-full bg-red-500" />
              Gravando! (clique p/ interromper)
            </button>

            <button
              type="submit"
              data-recording={isRecording}
              data-should-show-onboarding={shouldShowOnboarding}
              className="w-full bg-lime-400 py-4 text-center text-lg font-medium text-lime-950 outline-none transition hover:bg-lime-500 disabled:cursor-not-allowed data-[recording=true]:hidden data-[should-show-onboarding=true]:hidden"
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
