import { ChangeEvent } from 'react'
import { Pencil } from 'lucide-react'

type NoteEditFieldProps = {
  id?: string
  content: string
  handleContentChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextareaEditor({ content, handleContentChange }: NoteEditFieldProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <span className="pointer-events-none flex gap-1 self-end rounded-md text-sm text-lime-400">
        Editando <Pencil size={16} />
      </span>

      <textarea
        autoFocus
        className="scrollbar-hide flex-1 resize-none rounded-md bg-transparent p-2 text-lg leading-6 text-slate-200 outline-none ring-2 ring-lime-400/30 focus:ring-lime-400"
        onChange={handleContentChange}
        defaultValue={content}
        onFocus={(ev) => {
          const length = ev.currentTarget.value.length
          ev.currentTarget.setSelectionRange(length, length)
        }}
      />
    </div>
  )
}
