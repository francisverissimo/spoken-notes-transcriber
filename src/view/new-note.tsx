import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { NewNoteModeSelector } from './new-note-mode-selector'
import { NewNoteWrittingMode } from './new-note-writting-mode'
import { NewNoteRecordingMode } from './new-note-recording-mode'

interface NewNoteCardProps {
  handleCreateNote: (content: string) => void
}

export function NewNote({ handleCreateNote }: NewNoteCardProps) {
  const [mode, setMode] = useState<'selector' | 'recording' | 'writting'>('selector')

  const contentText = useRef<string>('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  function handleWrittingCancel() {
    contentText.current = ''
    setMode('selector')
  }

  function onDialogClose() {
    if (!contentText.current) {
      setMode('selector')
      return
    }

    localStorage.setItem('autosave_new_note', contentText.current)
  }

  function whenCreatingNote() {
    contentText.current = ''
    localStorage.removeItem('autosave_new_note')
    setMode('selector')
    closeButtonRef.current?.click()
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) onDialogClose()
      }}
    >
      <Dialog.Trigger className="rounded-4xl relative flex flex-col gap-y-3 bg-sky-700/80 p-5 text-left outline-none hover:ring hover:ring-sky-600 focus-visible:ring focus-visible:ring-sky-500">
        <span className="text-xl font-medium text-sky-50">adicionar nota</span>
        <p className="text-lg leading-6 text-sky-50">
          escreva ou fale, que seu áudio será transcrito para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="md:rounded-4xl fixed inset-0 flex w-full flex-col bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2">
          <Dialog.Close
            ref={closeButtonRef}
            className="absolute right-2 top-2 rounded-full bg-slate-800 p-4 text-slate-400 outline-none ring ring-transparent focus-within:ring-red-400 hover:text-red-400 focus-visible:text-red-400 md:-right-2 md:-top-2"
          >
            <X className="size-5" />
          </Dialog.Close>

          <span className="pt-5 text-center text-xl font-normal text-slate-200">
            adicionar nota
          </span>

          {mode == 'selector' && (
            <NewNoteModeSelector
              onStartRecording={() => setMode('recording')}
              onStartWriting={() => setMode('writting')}
            />
          )}

          {mode == 'recording' && (
            <NewNoteRecordingMode
              onStop={(transcribedText) => {
                contentText.current = transcribedText
                setMode('writting')
              }}
              onPreferToType={() => setMode('writting')}
            />
          )}

          {mode == 'writting' && (
            <NewNoteWrittingMode
              initialContentText={contentText.current}
              onCancel={handleWrittingCancel}
              onChange={(event) => {
                contentText.current = event.target.value
              }}
              whenCreatingNote={whenCreatingNote}
              createNote={(content) => handleCreateNote(content)}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
