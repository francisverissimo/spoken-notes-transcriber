import { FormEvent, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { NoteCreationMethodSelector } from './note-creation-method-selector'
import { Button } from './button'

interface NewNoteCardProps {
  handleCreateNote: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ handleCreateNote }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  const transcribedRef = useRef<HTMLTextAreaElement>(null)

  function handleStartWriting() {
    setShouldShowOnboarding(false)
    const textAreaEl = transcribedRef.current
    if (textAreaEl) {
      textAreaEl.focus()
    }
  }

  function handleCancelWritting() {
    setShouldShowOnboarding(true)
    setTextAreaValue('')
  }

  function setTextAreaValue(value: string) {
    const textAreaElement = transcribedRef.current
    if (!textAreaElement) return
    textAreaElement.value = value
  }

  function getTextAreaValue() {
    const textAreaElement = transcribedRef.current
    if (!textAreaElement) return ''
    return textAreaElement.textContent
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    const values = new FormData(event.target as HTMLFormElement)
    const content = values.get('content') as string

    if (!content) {
      toast.warning('Por favor, escreva algo.')
      return
    }

    handleCreateNote(content)
    setTextAreaValue('')
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

      setTextAreaValue(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    const textAreaEl = transcribedRef.current
    setIsRecording(false)

    if (speechRecognition) {
      speechRecognition.stop()
      speechRecognition = null
    }

    if (textAreaEl) {
      textAreaEl.focus()
    }
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        const content = getTextAreaValue()

        if (!open && !shouldShowOnboarding) {
          setShouldShowOnboarding(true)
        }

        if (!open && speechRecognition) {
          handleStopRecording()
        }

        if (open && content) {
          // se modal for fechado inesperadamente, adicionar valor do textArea em
          // LS 'unsaved_notes[new_note_unsaved]'
        }

        // se, ao abrir modal, existir valor em LS 'unsaved_notes[new_note_unsaved]'
        // atribuir esse valor ao textArea
      }}
    >
      <Dialog.Trigger className="relative flex flex-col gap-y-3 rounded-md bg-sky-700 p-5 text-left outline-none hover:ring hover:ring-sky-500 focus-visible:ring focus-visible:ring-lime-400">
        <span className="text-lg font-medium text-slate-200">Adicionar nota</span>
        <p className="text-lg leading-6 text-slate-200">
          Escreva ou fale, que seu áudio será transcrito para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 rounded-full bg-slate-800 p-4 text-slate-400 outline-none hover:text-red-400 focus-visible:text-red-400 md:-right-2 md:-top-2">
            <X className="size-5" />
          </Dialog.Close>

          <form onSubmit={handleSaveNote} className="flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex flex-col gap-2">
                <span className="text-center text-xl font-normal uppercase text-slate-200">
                  Adicionar nota
                </span>
              </div>

              {shouldShowOnboarding ? (
                <NoteCreationMethodSelector
                  onStartRecording={handleStartRecording}
                  onStartWriting={handleStartWriting}
                />
              ) : (
                <div className="flex h-full w-full flex-col">
                  <textarea
                    autoFocus={!shouldShowOnboarding}
                    className="scrollbar-hide flex-1 resize-none rounded-md bg-slate-600/50 p-2 text-lg leading-6 text-slate-200 outline-none transition focus:shadow-2xl data-[hidden=true]:hidden"
                    ref={transcribedRef}
                    name="content"
                    data-hidden={shouldShowOnboarding}
                    onFocus={(ev) => {
                      const length = ev.currentTarget.value.length
                      ev.currentTarget.setSelectionRange(length, length)
                    }}
                  />
                </div>
              )}
            </div>

            <Button
              type="button"
              data-recording={isRecording}
              onClick={handleStopRecording}
              // className="hidden w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-lg font-medium text-slate-300 outline-none transition hover:text-slate-100 data-[recording=true]:flex"
            >
              <div className="size-3 animate-pulse rounded-full bg-red-500" />
              Gravando! (clique p/ interromper)
            </Button>

            <div className="flex items-center justify-center">
              {!isRecording && !shouldShowOnboarding && (
                <Button
                  value="cancelar"
                  color="red-500"
                  type="button"
                  onClick={handleCancelWritting}
                />
              )}

              {/* <button
                type="submit"
                data-recording={isRecording}
                data-should-show-onboarding={shouldShowOnboarding}
                className="mx-auto w-full rounded-full px-5 py-4 text-center text-lg font-medium uppercase text-lime-400 outline-none transition hover:underline disabled:cursor-not-allowed data-[recording=true]:hidden data-[should-show-onboarding=true]:hidden md:mb-5 md:w-fit"
              >
                Salvar
              </button> */}

              {/* first:md:-translate-x-5  */}

              <Button type="submit" color="lime-400" value="salvar" className='md:translate-x-5' />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
