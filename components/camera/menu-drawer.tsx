"use client"

import { useEffect } from "react"
import { X, BookMarked, Layers, ChevronRight } from "lucide-react"

type MenuDrawerProps = {
  open: boolean
  onClose: () => void
}

const LINKS = [
  { label: "Từ vựng đã lưu", description: "Bộ sưu tập từ của bạn", icon: BookMarked, href: "#" },
  { label: "Flashcard", description: "Ôn tập theo thẻ ghi nhớ", icon: Layers, href: "#" },
]

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-label="Menu điều hướng"
        aria-modal="true"
        className={`absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-neutral-900 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div>
            <p className="text-lg font-semibold text-neutral-50">LingoLens</p>
            <p className="text-sm text-neutral-400">Học từ vựng qua ống kính</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="flex size-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700 active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-3 pt-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-3 rounded-2xl bg-neutral-800/50 px-3 py-3.5 transition-colors hover:bg-neutral-800"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <link.icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-neutral-50">{link.label}</span>
                <span className="block text-xs text-neutral-400">{link.description}</span>
              </span>
              <ChevronRight className="size-4 text-neutral-500 transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}
