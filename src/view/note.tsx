import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/button'

interface UnsavedNotes extends Record<string, string> {}

interface NoteProps {
  note: {
    id: string
    date: Date
    content: string
  }
  deleteNote: (id: string) => void
  editNote: (id: string, content: string) => void
}

function getUnsavedNotes() {
  const unsavedNotesString = localStorage.getItem('unsaved_notes')
  return unsavedNotesString ? (JSON.parse(unsavedNotesString) as UnsavedNotes) : null
}

function removeUnsavedNoteEntry(noteId: string) {
  const unsavedNotes = getUnsavedNotes()

  if (!unsavedNotes || !unsavedNotes[noteId]) return

  delete unsavedNotes[noteId]

  localStorage.setItem('unsaved_notes', JSON.stringify(unsavedNotes))
}

export function Note({ note, deleteNote, editNote }: NoteProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  const unsavedNotes = getUnsavedNotes()
  const noteUnsavedChanges = unsavedNotes && unsavedNotes[note.id] ? unsavedNotes[note.id] : null

  let contentText = noteUnsavedChanges ?? note.content

  function handleSave() {
    if (contentText == note.content) {
      toast.warning('Sem alterações.')
      return
    }
    editNote(note.id, contentText)
    removeUnsavedNoteEntry(note.id)
    setShouldShowOnboarding(false)
    toast.success('Nota atualizada.')
  }

  function handleCancel() {
    contentText = ''
    setShouldShowOnboarding(false)
  }

  function handleCloseDialog() {
    const hasContentChange = contentText != note.content
    const unsavedNotes = getUnsavedNotes()

    if (hasContentChange) {
      if (!unsavedNotes) {
        localStorage.setItem('unsaved_notes', JSON.stringify({ [note.id]: contentText }))
      } else {
        unsavedNotes[note.id] = contentText
        localStorage.setItem('unsaved_notes', JSON.stringify(unsavedNotes))
      }
    } else {
      if (unsavedNotes && unsavedNotes[note.id]) {
        delete unsavedNotes[note.id]
        localStorage.setItem('unsaved_notes', JSON.stringify(unsavedNotes))
      }
    }

    shouldShowOnboarding && setShouldShowOnboarding(false)
  }

  function handleOpenDialog() {
    !!noteUnsavedChanges && setShouldShowOnboarding(true)
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog()
        } else {
          handleOpenDialog()
        }
      }}
    >
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-700 p-5 outline-none hover:ring hover:ring-slate-600 focus-visible:ring focus-visible:ring-lime-400">
        <span className="text-left text-lg font-medium text-slate-300">
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>

        {noteUnsavedChanges && (
          <span className="absolute right-2 top-0 text-sm text-yellow-300">
            alterações não salvas
          </span>
        )}

        <p className="text-md text-start leading-6 text-slate-400">{note.content}</p>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 rounded-full bg-slate-800 p-4 text-slate-400 outline-none hover:text-red-400 focus-visible:text-red-400 md:-right-2 md:-top-2">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-lg font-medium text-slate-300">
              {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
            </span>
            
            {shouldShowOnboarding ? (
              <textarea
                autoFocus
                className="scrollbar-hide flex-1 resize-none rounded-md bg-slate-600/50 p-2 text-lg leading-6 text-slate-200 outline-none transition focus:shadow-2xl"
                defaultValue={contentText}
                onChange={(event) => {
                  contentText = event.target.value
                }}
                onFocus={(ev) => {
                  const length = ev.currentTarget.value.length
                  ev.currentTarget.setSelectionRange(length, length)
                }}
              />
            ) : (
              <p className="text-lg leading-6 text-slate-400">{contentText}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 md:gap-x-0">
            {shouldShowOnboarding ? (
              <>
                <Button
                  type="button"
                  value="Cancelar"
                  color="slate-300"
                  className="md:-translate-x-5"
                  onClick={handleCancel}
                />

                <Button
                  type="button"
                  value="Salvar"
                  color="lime-400"
                  className="md:translate-x-5"
                  onClick={handleSave}
                />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  value="Editar nota"
                  color="cyan-500"
                  className="md:-translate-x-5"
                  onClick={() => setShouldShowOnboarding(true)}
                />

                <Button
                  type="button"
                  value="Apagar nota"
                  color="red-500"
                  className="md:translate-x-5"
                  onClick={() => deleteNote(note.id)}
                />
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
