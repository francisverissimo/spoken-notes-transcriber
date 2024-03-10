export function NoteCard() {
  return (
    <button className="relative space-y-3 overflow-hidden rounded-md bg-slate-700 p-5 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
      <span className="text-sm font-medium text-slate-300">Há 2 dias</span>
      <p className="text-sm leading-6 text-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa reiciendis mollitia nulla
        ducimus quidem! Soluta corporis voluptatum nihil ipsam, nisi repellendus consectetur, eaque
        asperiores ullam nam deleniti, rerum quaerat atque. Ducimus quidem! Soluta corporis
        voluptatum nihil ipsam, nisi repellendus consectetur, eaque asperiores ullam nam deleniti,
        rerum quaerat atque.
      </p>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
    </button>
  )
}
