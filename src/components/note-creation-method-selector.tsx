import { Keyboard, Mic } from 'lucide-react'

interface NoteCreationMethodSelectorProps {
  onStartRecording: () => void
  onStartWriting: () => void
}

export function NoteCreationMethodSelector({
  onStartRecording,
  onStartWriting,
}: NoteCreationMethodSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <button
        type="button"
        onClick={onStartRecording}
        className="flex items-center justify-center gap-2 rounded-full bg-slate-800 px-2 py-4 text-lg text-lime-400 hover:underline"
      >
        <Mic /> Transcrever texto falando
      </button>

      <button
        type="button"
        onClick={onStartWriting}
        className="item-center flex justify-center gap-2 rounded-full bg-slate-800 px-2 py-4 text-lg text-slate-300 hover:underline"
      >
        <Keyboard /> Escrever nota
      </button>
    </div>
  )
}
