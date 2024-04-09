import { ChangeEvent, useState } from 'react'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import logo from './assets/logo-nlw-expert.svg'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('notes')

    if (storedNotes) {
      return JSON.parse(storedNotes)
    }

    return []
  })

  function handleCreateNote(content: string) {
    const newNote = { id: crypto.randomUUID(), date: new Date(), content }

    const arrayNotes = [newNote, ...notes]

    setNotes(arrayNotes)

    localStorage.setItem('notes', JSON.stringify(arrayNotes))
  }

  function handleDeleteNote(id: string) {
    const arrayNotes = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(arrayNotes)

    localStorage.setItem('notes', JSON.stringify(arrayNotes))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const search = event.target.value

    setSearch(search)
  }

  const notesFiltered =
    search !== ''
      ? notes.filter((note) => {
          return note.content.toLowerCase().includes(search.toLowerCase())
        })
      : notes

  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <NewNoteCard handleCreateNote={handleCreateNote} />

        {notesFiltered.map((note) => {
          return <NoteCard key={note.id} note={note} handleDeleteNote={handleDeleteNote} />
        })}
      </div>
    </div>
  )
}
