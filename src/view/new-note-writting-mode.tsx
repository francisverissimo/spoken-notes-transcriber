import { Button } from '@/components/button'
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface NewNoteWrittingModeProps {
  initialContentText: string
  onChange(event: ChangeEvent<HTMLTextAreaElement>): void
  onCancel(): void
  createNote(content: string): void
  whenCreatingNote(): void
}

export function NewNoteWrittingMode({
  initialContentText,
  onChange,
  onCancel,
  createNote,
  whenCreatingNote,
}: NewNoteWrittingModeProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // function getTextAreaValue() {
  //   const textAreaEl = textAreaRef.current
  //   return textAreaEl ? textAreaEl.textContent : ''
  // }

  function setTextAreaValue(value: string) {
    const textAreaEl = textAreaRef.current
    if (textAreaEl) textAreaEl.value = value
  }

  function handleFocus(event: FocusEvent<HTMLTextAreaElement>) {
    const length = event.target.value.length
    event.currentTarget.setSelectionRange(length, length)
  }

  function handleCancel() {
    onCancel()
    const autoSaveNewNote = localStorage.getItem('autosave_new_note')
    if (autoSaveNewNote) localStorage.removeItem('autosave_new_note')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const form = new FormData(event.target as HTMLFormElement)
    const content = form.get('content')

    if (!content) {
      toast.warning('por favor, escreva algo.')
      return
    }

    createNote(content as string)
    toast.success('nota criada com sucesso!')
    form.set('content', '')
    whenCreatingNote()
  }

  useEffect(() => {
    const autoSaveNewNote = localStorage.getItem('autosave_new_note')

    if (autoSaveNewNote) {
      setTextAreaValue(autoSaveNewNote)
      return
    }
    if (initialContentText) setTextAreaValue(initialContentText)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-2">
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex h-full w-full flex-col">
          <textarea
            autoFocus
            name="content"
            ref={textAreaRef}
            onChange={onChange}
            onFocus={handleFocus}
            className="scrollbar-hide flex-1 resize-none rounded-xl bg-slate-600/50 p-2 text-lg leading-6 text-slate-200 outline-none transition focus:shadow-2xl data-[hidden=true]:hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-2 pb-2">
        <Button
          type="button"
          color="red-500"
          value="cancelar"
          onClick={handleCancel}
          className="md:-translate-x-5"
        />
        <Button type="submit" color="lime-400" value="salvar" className="md:translate-x-5" />
      </div>
    </form>
  )
}
