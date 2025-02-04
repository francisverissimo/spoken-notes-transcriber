import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { TextareaEditor } from './textarea-editor'

interface NoteCardProps {
  note: {
    id: string
    date: Date
    content: string
  }
  deleteNote: (id: string) => void
  editNote: (id: string, content: string) => void
}

export function NoteCard({ note, deleteNote, editNote }: NoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const { id, date, content } = note
  let newContentText = content

  function handleSave() {
    if (newContentText == content) {
      toast.warning('Sem alterações.')
      return
    }
    editNote(id, newContentText)
    setShouldShowOnboarding(false)
    toast.success('Nota atualizada.')
  }

  function handleCancel() {
    newContentText = ''
    setShouldShowOnboarding(false)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-700 p-5 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-lg font-medium text-slate-300">
          {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className="text-md text-start leading-6 text-slate-400">{content}</p>
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
              {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
            </span>
            {shouldShowOnboarding ? (
              <TextareaEditor
                handleContentChange={(event) => {
                  newContentText = event.target.value
                }}
                content={content}
              />
            ) : (
              <p className="text-lg leading-6 text-slate-400">{content}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 md:gap-x-0">
            {shouldShowOnboarding ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="group w-full rounded-full bg-slate-800 py-4 text-center text-lg font-medium text-slate-300 outline-none md:-translate-x-5"
                >
                  <span className="text-slate-300 group-hover:underline">Cancelar</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="group w-full rounded-full bg-slate-800 py-4 text-center text-lg font-medium text-slate-300 outline-none md:translate-x-5"
                >
                  <span className="text-lime-400 group-hover:underline">Salvar</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShouldShowOnboarding(true)}
                  className="group w-full rounded-full bg-slate-800 py-4 text-center text-lg font-medium text-slate-300 outline-none md:-translate-x-5"
                >
                  <span className="text-cyan-500 group-hover:underline">Editar nota</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="group w-full rounded-full bg-slate-800 py-4 text-center text-lg font-medium text-slate-300 outline-none md:translate-x-5"
                >
                  <span className="text-red-500 group-hover:underline">Apagar nota</span>
                </button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
